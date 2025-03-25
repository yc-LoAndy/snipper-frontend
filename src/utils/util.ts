export function getFileExtension(filePath: string) {
	const fileName = filePath.split('/').pop();
	if (!fileName)
		return '';
	const parts = fileName.split('.');
	if (parts.length <= 1) return '';
	const extension = parts.pop()!.toLowerCase();
	return extension;
}

export function trimAny(str: string, chars: string[]) {
    let start = 0, end = str.length;

    while(start < end && chars.indexOf(str[start]) >= 0)
        ++start;

    while(end > start && chars.indexOf(str[end - 1]) >= 0)
        --end;

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}
