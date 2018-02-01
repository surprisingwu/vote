var vueRouter = new VueRouter({
  routes: [
    {
      path: '/publish',
      component: voteComponents.PublishVote
    },
    {
      path: '/vote',
      component: voteComponents.VoteDetail,
      children: [
        {
          path:'detail',
          component: voteComponents.VoteitemDetail
        }
      ]
    }
  ]
})
