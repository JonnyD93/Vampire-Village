module.exports = (app, status) => {
    app.route('/data/get')
      .post((req, res) => {
        const body = req.body;
        res.send(body);
      });
    app.route('/data/set')
      .post((req, res) => {
        const request = req.body,
          path = request.path || "",
          key = request.key || undefined;

        let obj = request;
        delete obj.path;
        delete obj.key;

        data.set(path, key, obj);
        status(res, true);
      })
  };
