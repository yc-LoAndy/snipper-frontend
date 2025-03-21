export function strCount(s: string, p: string) {
	return s.length - s.replaceAll(p, '').length;
}
