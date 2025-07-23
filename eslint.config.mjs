// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommendedTypeChecked, {
	languageOptions: {
		parserOptions: {
			tsconfigRootDir: import.meta.dirname,
			project: './tsconfig.json'
		}
	},
	rules: {
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-misused-promises': 'off'
	}
});
