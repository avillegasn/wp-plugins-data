const fs = require( 'fs' );
const request = require( 'request-promise-native' );

async function getPluginData() {
	const plugins = [];
	const url = 'https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[browse]=popular&request[per_page]=250';
	let currentId = 0;
	let currentPage = 0;
	let totalPages = 0;
	let totalPlugins = 0;

	do {
		const data = await request( `${ url }&request[page]=${ ++currentPage }` );
		const json = JSON.parse( data );
		const {
			info: {
				pages,
				results
			},
			plugins: rawPlugins
		} = json;

		totalPages = pages;
		totalPlugins = results;

		plugins.push( ...rawPlugins.map( plugin => ( { ...plugin, id: ++currentId } ) ) );
		console.log( `Processed ${ plugins.length }/${ totalPlugins } plugins...` );

	} while( currentPage < totalPages );

	console.log( 'Writing output file...' );
	fs.writeFileSync('./data/plugins.json', JSON.stringify( plugins ) );
	console.log( 'Done!' );

}

getPluginData();
