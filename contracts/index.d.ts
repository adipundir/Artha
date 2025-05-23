// This file exists to help TypeScript ignore Solidity files
declare module '*.sol' {
  const content: any;
  export default content;
} 