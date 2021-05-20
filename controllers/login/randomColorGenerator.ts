const randomColorGenerator = (): string => {
	const initialColorList: string[] = [
		'#F44336',
		'#E92763',
		'#9C27B0',
		'#673AB7',
		'#3F51B5',
		'#2196F3',
		'#019688',
		'#4CAF50',
		'#60A068',
		'#484A25',
		'#FF981A',
		'#795648',
		'#FF5722',
		'#8CA3CB',
		'#F1D236',
		'#F49EB3',
	];
	return initialColorList[Math.floor(Math.random() * initialColorList.length)];
};

export default randomColorGenerator;
