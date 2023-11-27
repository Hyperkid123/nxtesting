import React from 'react';

import { reactCore } from '@ mmnxtest/react-core';
export function App() {
  return (
    <React.Suspense fallback={null}>
      <div>
        <h1>
        There will be dragons
        </h1>
        <p>
        {reactCore()}
        </p>
      </div>
    </React.Suspense>
  );
}

export default App;
