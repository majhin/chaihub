function Loader() {
	return (
		<div className='text-center mt-5'>
			<div className='spinner-border text-primary' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</div>
			<p className='mt-3'>
				Loading...{" "}
				<span role='img' aria-label='Loading Emoji'>
					⌛
				</span>
			</p>
		</div>
	);
}

export default Loader;
