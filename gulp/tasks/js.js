import webpack from 'webpack-stream'
import { webpackConfig } from '../../webpack.config.js'

import include from 'gulp-include'

export const js = () =>
  app.gulp
    .src(app.path.src.js, { sourcemaps: app.isDev })
    .pipe(include())
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'JS',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(app.gulp.dest(app.path.build.js))
    .pipe(app.plugins.browserSync.stream())
