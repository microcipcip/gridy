(function () {
  'use strict'



  //===============================================================/
  //  =vue resource
  //===============================================================/

  var baseUrl = location.protocol + '//' + location.host + location.pathname
  Vue.http.options.root = baseUrl



  //===============================================================/
  //  =router page
  //===============================================================/

  var Page = Vue.extend({
    template: '{{{content}}}',
    data: function () {
      return {
        content: '',
        timerRouteStart: null,
        timerRouteReady: null
      }
    },
    methods: {
      highlight: function ($parent) {
        var $codeBlock = $parent.querySelectorAll('pre code')
        Array.prototype.forEach.call($codeBlock, function ($el, i) {
          hljs.highlightBlock($el)
        })
      }
    },
    route: {
      activate: function (transition) {
        this.timerRouteStart = Date.now() | 0
        transition.next()
      },
      data: function (transition) {
        // generate url
        var pageUrl = transition.to.path === '/' ? 'intro' : transition.to.path
        pageUrl = baseUrl + 'docs/pages/' + pageUrl + '.html'

        this.$http.get(pageUrl).then(function (response) {
          // display route after a small delay
          this.timerRouteReady = Date.now() | 0
          var timerDiff = 500 - (this.timerRouteReady - this.timerRouteStart)

          setTimeout(function () {
            // update content
            this.content = response.body

            // show page
            document.body.classList.add('route-transition')

            Vue.nextTick(function () {
              // generate source code dinamically
              var $docs = this.$root.$els.wrap.querySelectorAll('.doc')
              Array.prototype.forEach.call($docs, function ($doc, i) {
                var $docGrid = $doc.querySelector('.doc__grid'),
                  docGridCnt = this.$root.escapeDocs($docGrid.innerHTML),
                  docSource = $doc.querySelector('.doc__source code')

                docSource.innerHTML = docGridCnt
              }.bind(this))

              // clean up any other pre code
              var $docCustomSource = this.$root.$els.wrap.querySelectorAll('.doc-custom__source code')
              Array.prototype.forEach.call($docCustomSource, function ($docSource, i) {
                var docSourceCnt = this.$root.escapeDocsCustom($docSource.innerHTML)

                $docSource.innerHTML = docSourceCnt
              }.bind(this))

              // code highlighter
              this.highlight(this.$root.$els.wrap)

              // enable codepen
              var $docDemo = this.$root.$els.wrap.querySelectorAll('.doc-demo')
              if ($docDemo.length) {
                this.$root.injectScript({
                  $appendTo: 'body',
                  url: '//assets.codepen.io/assets/embed/ei.js'
                })
              }
            }.bind(this))

            transition.next()
          }.bind(this), timerDiff)
        }, function (response) {
          // error callback
          document.body.classList.add('route-transition')
          this.content =
            '<div class="typ -center -text-center -text-medium">' +
            '<h1>Page not found</h1>' +
            '<p>Ooops...something went terribly wrong...</p>' +
            '<img src="docs/dist/img/general/404.png" alt="">' +
            '</div>'

          transition.next()
        })
      },
      canReuse: function () {
        document.body.classList.remove('route-transition')
      }
    },
    ready: function () {}
  })



  //===============================================================/
  //  =init
  //===============================================================/

  var App = Vue.extend({
    data: function () {
      return {}
    },
    methods: {
      escapeDocs: function (unsafe) {
        return unsafe
          .replace(/<div class="doc__box".*?<\/div>/g, '...')
          .replace(/^    /gm, '') // remove first two tabs for each line
          .replace(/^\s+|\s+$/g, '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      },
      escapeDocsCustom: function (unsafe) {
        return unsafe
          .replace(/^        /gm, '') // remove first four tabs for each line
          .replace(/^\s+|\s+$/g, '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      },
      injectScript: function (opts) {
        if (!opts.$appendTo || !opts.url) return

        var $script = document.createElement('script')
        $script.type = 'text/javascript'
        $script.async = true
        $script.onload = function () {
          $script.parentNode.removeChild($script)
        }
        $script.src = opts.url
        document.querySelector(opts.$appendTo).appendChild($script)
      },
      toggleNav: function (e) {
        this.$els.header.classList.toggle('-expanded')
      },
      delegations: function (e) {

        //===============================================================/
        //  =links
        //===============================================================/

        var $link = e.target.closest('a')
        if (!$link) return

        // route link
        var dataHref = $link.dataset.href
        if (dataHref) {
          e.preventDefault()
          this.$router.go(dataHref)
          return
        }

        // toggle code
        var $sourceCode = this.$els.wrap.querySelector('[source="' + $link.getAttribute('source-target') + '"]')
        if ($sourceCode) {
          e.preventDefault()
          $link.classList.toggle('-expand')
          $sourceCode.classList.toggle('-expand')
          return
        }

      }
    }
  })

  var router = new VueRouter({
    linkActiveClass: '-active',
    transitionOnLoad: true,
    hashbang: true
  })

  router.map({
    '/': {
      component: Page
    },
    ':page': {
      component: Page
    }
  })

  router.start(App, '#app')
})()
