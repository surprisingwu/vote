var vueRouter = new VueRouter({
  routes: [
    {
      path: '/index/publish',
      component: components.PublishVote
    },
    {
      path: '/index/vote',
      component: components.VoteDetail
    }
  ]
})
