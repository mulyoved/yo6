
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log('static: %s', express.static(path.join(__dirname, '../app')));
  //res.sendfile(
  res.render('index', { title: 'Express' });
};