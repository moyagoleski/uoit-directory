export const StartFromFilter = () => {
	return (input, start) => input ? input.slice(+start || 0) : input;
};