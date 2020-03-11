# WordPress Plugins Data

Node.js code to get data from the WordPress Plugin Directory in JSON and SQLite/SQL formats using official WordPress.org API.

## Getting Started

These instructions will let you download data from the plugins within the official WordPress Plugin Directory. See usage for notes on how to execute the scripts on your local copy.

### Prerequisites

In order to execute the code you need `NodeJS` and `npm` on your local environment. Then you need to execute the following on a terminal inside the project folder to isntall the `NodeJS` dependencies:

```
npm install
```

### Usage

To download the data from the plugins in the WordPress Plugin Directory do the following:

```
node get-plugin-data.js
```

Note that this may take a while to complete since the WordPress repository contains ~50K plugins and the API calls retrieve pages of 250 plugins on every request. The resulting file is located in `data/plugins.json`. Note that this is a huge JSON file (+150MB).

To download a reduced version of the data from the plugins in the WordPress Plugin Directory do the following:

```
node get-plugin-ranking.js
```

The process is the same as with `get-plugin-data.js` but the output goes to a JSON file located in `./ranking/YYYY-MM-DD.json` where `YYYY-MM-DD` refers to the current date when you executed the previous command. This allows you to have historical data about the popularity of plugins in the WordPress Plugin Directory over time.

Finally, to transform the big `data/plugins.json` file into a SQL one that you can load into your preferred SQL-compatible server do the following:

```
node json-to-sql.js
```

This will transform `data/plugins.json` into `data/plugins.sql` by using SQLite3. The process also produces `data/plugins.db`, which is the SQLite3 database file, in case you need it.

The SQL database contains two tables: `plugins` and `tags`. The data there is the same you find in the `data/plugins.json` file, but now you can easily execute SQL queries over this data.

## Authors

* **Antonio Villegas** - *Initial work* - [Nelio Software](https://neliosoftware.com/)

## License

This project is licensed under the GPLv3 License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Dion Hulse for [this post](http://dd32.id.au/projects/wordpressorg-plugin-information-api-docs/).
* WordPress Codex Contributors for the [documentation](https://codex.wordpress.org/WordPress.org_API).
* [Rarst](https://github.com/Rarst) for this answer on [WordPress StackExchange](https://wordpress.stackexchange.com/questions/273461/how-do-i-retrieve-a-list-of-popular-plugins-using-the-wordpress-org-plugin-api). Also, check out [wporg-client](https://github.com/Rarst/wporg-client) if you prefer to use PHP instead of NodeJS.

