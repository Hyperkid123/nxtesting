import { core } from '@mmnxtest/core'

export function reactCore(): string {
  console.log(core(), 'bla bla something')

  return 'react-core!';
}
