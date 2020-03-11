const fs = require( 'fs' );
const request = require( 'request-promise-native' );

async function getPluginRanking() {
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

		plugins.push( ...rawPlugins.map( plugin => {
			const {
				name,
				slug,
				rating,
				active_installs,
				downloaded,
				addded,
				last_updated,
				icons: {
					'1x': icon
				}
			} = plugin;

			return { id: ++currentId, name, slug, rating, active_installs, downloaded, addded, last_updated, icon };
		} ) );
		console.log( `Processed ${ plugins.length }/${ totalPlugins } plugins...` );

	} while( currentPage < totalPages );

	console.log( 'Writing output file...' );
	fs.writeFileSync( `./ranking/${ new Date().toISOString().split('T')[0] }.json`, JSON.stringify( plugins ) );
	console.log( 'Done!' );

}

getPluginRanking();
