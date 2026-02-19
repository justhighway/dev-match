export default {
  '*.{js,ts,tsx}': ['eslint --fix', 'prettier --write', 'git add'],
  '*.{css,scss,json,md}': ['prettier --write', 'git add'],
};
