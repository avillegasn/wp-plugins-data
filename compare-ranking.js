const fs = require( 'fs' );
const { Parser } = require( 'json2csv' );

function main() {
	const data = [];
	const oldRanking = JSON.parse(
		fs.readFileSync( './ranking/2020-03-10.json', 'utf-8' )
	);

	const newRanking = JSON.parse(
		fs.readFileSync( './ranking/2022-01-18.json', 'utf-8' )
	);

	const findPlugin = ( slug, set ) => {
		if ( set === 'new' ) {
			return newRanking.find( p => p.slug === slug )
		}

		if ( set === 'old' ) {
			return oldRanking.find( p => p.slug === slug ) || {}
		}
	}

	for ( let i = 0; i < oldRanking.length; i++ ) {
		const oldP = oldRanking[i];
		const newP = findPlugin( oldP.slug, 'new' );

		data.push({
			name: oldP.name,
			slug: oldP.slug,
			rank_old: oldP.id,
			rank_new: newP?.id,
			rating_old: oldP.rating,
			rating_new: newP?.rating,
			active_installs_old: oldP.active_installs,
			active_installs_new: newP?.active_installs,
			downloaded_old: oldP.downloaded,
			downloaded_new: newP?.downloaded,
			last_updated: newP?.last_updated || oldP.last_updated
		});
	}

	for ( let i = 0; i < newRanking.length; i++ ) {
		const newP = newRanking[i];
		const oldP = findPlugin( newP.slug, 'old' );

		if ( ! oldP ) {
			data.push({
				name: newP.name,
				slug: newP.slug,
				rank_old: undefined,
				rank_new: newP.id,
				rating_old: undefined,
				rating_new: newP.rating,
				active_installs_old: undefined,
				active_installs_new: newP.active_installs,
				downloaded_old: undefined,
				downloaded_new: newP.downloaded,
				last_updated: newP.last_updated
			});
		}
	}

	const fields = Object.keys( data[ 0 ] );
	const csv = new Parser( { fields } );
	fs.writeFileSync( './ranking/comparison.csv', csv.parse( data ) );
}

main();
