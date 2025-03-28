import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { yaml } from '@codemirror/lang-yaml';
import { vue } from '@codemirror/lang-vue';
import { oneDark } from '@codemirror/theme-one-dark';
import { getFileExtension } from './util';

const extMap = new Map([
    ['.js', javascript()],
    ['.html', html()],
    ['.json', json()],
    ['.py', python()],
    ['.css', css()],
    ['.cpp', cpp()],
    ['.java', java()],
    ['.md', markdown()],
    ['.sql', sql()],
    ['.yaml', yaml()],
    ['.yml', yaml()],
    ['.vue', vue()],
]);

export function getExtension(filename?: string) {
	const ext = [oneDark];
    if (!filename)
        return ext;
	const fileExt = '.' + getFileExtension(filename);
    if (extMap.has(fileExt)) {
        ext.push(extMap.get(fileExt)!);
    }
    return ext;
}
