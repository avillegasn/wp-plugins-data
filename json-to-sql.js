const { exec } = require( 'child_process' );
const fs = require( 'fs' );
const sqlite3 = require( 'sqlite3' ).verbose();

if ( ! fs.existsSync( './data/plugins.json' ) ) {
	console.log( 'Unable to find plugins.json file. Execute first: node get-plugin-data' );
	return;
}//end if

const fileContents = fs.readFileSync( './data/plugins.json' );
const plugins = JSON.parse( fileContents );

// Remove old export data, if it exists.
if ( fs.existsSync( './data/plugins.db' ) ) {
	fs.unlinkSync( './data/plugins.db' );
}//end if

if ( fs.existsSync( './data/plugins.sql' ) ) {
	fs.unlinkSync( './data/plugins.sql' );
}//end if

const db = new sqlite3.Database( './data/plugins.db' );

db.serialize( () => {

	db.run( `CREATE TABLE plugins(
		id INTEGER PRIMARY KEY,
		name TEXT,
		slug TEXT,
		author TEXT,
		requires TEXT,
		rating INTEGER,
		num_ratings INTEGER,
		support_threads INTEGER,
		support_threads_resolved INTEGER,
		active_installs INTEGER,
		downloaded INTEGER,
		last_updated TEXT,
		added TEXT,
		homepage TEXT,
		short_description TEXT,
		icon TEXT
	)` );

	db.run( `CREATE TABLE tags(
		plugin_id INTEGER,
		tag TEXT
	)` );

	var pluginStmt = db.prepare( 'INSERT INTO plugins VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )' );
	var tagsStmt = db.prepare( 'INSERT INTO tags VALUES (?, ?)' );

	plugins.forEach( plugin => {

		const {
			id,
			name,
			slug,
			author,
			requires,
			rating,
			num_ratings,
			support_threads,
			support_threads_resolved,
			active_installs,
			downloaded,
			last_updated,
			added,
			homepage,
			description,
			short_description,
			icons: {
				"1x": icon
			},
			tags
		} = plugin;
		pluginStmt.run( id, name, slug, author, requires, rating, num_ratings, support_threads, support_threads_resolved, active_installs, downloaded, last_updated, added, homepage, short_description, icon );

		Object.keys( tags ).forEach( tag => {
			tagsStmt.run( id, tag );
		});

		console.log( `${ id } – ${ name }` );

	});

	pluginStmt.finalize();
	tagsStmt.finalize();

});

db.close( ( error ) => {

	if ( error ) {
		return console.error( error.message );
	}//end if

	exec( 'sqlite3 ./data/plugins.db .dump > ./data/plugins.sql', ( error ) => {
		if ( error ) {
			return console.error( error.message );
		}//end if
	} );

} );

