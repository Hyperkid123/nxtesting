import { ExecutorContext, createProjectGraphAsync } from '@nx/devkit';
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import * as semver from 'semver';

export interface EchoExecutorOptions {
  textToEcho: string;
}

const RANGE_REGEX = /^\D/

function shouldBumpDependency(metadata: DependencyMetadata, currentRange: string) {
  if(!semver.valid(metadata.version)) {
    return false
  }

  
  if(!semver.satisfies(metadata.version, currentRange)) {
    return false
  }
  return true
}

type DependencyMetadata = {
  source: string
  target: string
  type: string
  path: string
  version: string
}

export default async function syncDependencies(
  options: EchoExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.info(`Executing "sync dependencies"...`);
  try {
    const projectName = context.projectName;
    const currentProjectRoot = context.projectsConfigurations?.projects?.[projectName]?.root
    const root = context.root;
    const dependencyGraph = await createProjectGraphAsync()
    const projectPackageJsonPath = join(root, currentProjectRoot, 'package.json')
    const projectPackageJson = JSON.parse(readFileSync(projectPackageJsonPath).toString())
    const projectDependencies = dependencyGraph.dependencies[projectName]?.filter(d => !d.target.startsWith('npm:'))
    const dependenciesMetadata = projectDependencies.reduce<DependencyMetadata[]>((acc, d) => {
      const packageRoot = context.projectsConfigurations?.projects?.[d.target]?.root
      if(packageRoot) {
        const packageJson = JSON.parse(readFileSync(join(root, packageRoot, 'package.json')).toString())
        acc.push({
          ...d,
          path: join(root, packageRoot),
          version: packageJson.version
        })
      }
      return acc
    }, [])
  
    dependenciesMetadata.forEach(d => {
      const currentRange = projectPackageJson.dependencies[d.target]
      const shouldBump = shouldBumpDependency(d, currentRange)
      if(shouldBump) {
        const maxVersion = semver.maxSatisfying([d.version, currentRange], currentRange)
        const prefix = currentRange.match(RANGE_REGEX)?.[0] || ''
        const newVersion = `${prefix}${maxVersion}`
        projectPackageJson.dependencies[d.target] = newVersion
        
      }
    })
    writeFileSync(projectPackageJsonPath, JSON.stringify(projectPackageJson, null, 2).concat('\n'), { encoding: 'utf-8' })
    return { success: true }
    
  } catch (error) {
    console.error(error)
    return { success: false };
    
  }

 
}