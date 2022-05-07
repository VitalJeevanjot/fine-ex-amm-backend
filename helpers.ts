const fs: any = require('fs')
const path: any = require('path')

const setRequiredVariable = (variableName: string) => {
  if (process.env[variableName]) {
    return process.env[variableName];
  }
  throw new Error(`ENV-variable missing: ${variableName}`);
}


export {
  setRequiredVariable
}