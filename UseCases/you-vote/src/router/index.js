import Vue from "vue";
import Tabs from '../views/Tabs.vue'
import Home from '../views/Home.vue'
import YouVote from '../views/YouVote.vue'
import AboutUs from '../views/AboutUs.vue'
import Discover from '../views/home-views/Discover.vue'
import Participate from '../views/home-views/Participate.vue'
import CreateNew from '../views/home-views/CreateNew.vue'
import { IonicVueRouter } from "@ionic/vue";

Vue.use(IonicVueRouter);

const routes = [
  {
    path: "/",
    component: Tabs,
    children: [
      {
        path: "/",
        name: "home",
        props: true,
        components: {
          home: Home
        },
        children:[
          { path: "/", redirect: "/discover" },
          {
            path: "/discover",
            name: "discover",
            props: true,
            components: {
              discover: Discover
            }
          },          {
            path: "/participate",
            name: "participate",
            props: true,
            components: {
              participate: Participate
            }
          },
          {
            path: "/create-new",
            name: "createnew",
            props: true,
            components: {
              createnew: CreateNew
            }
          },
        ]
      },
      {
        path: "/you-vote",
        name: "youvote",
        props: true,
        components: {
          youvote: YouVote
        }
      },
      {
        path: "/about-us",
        name: "aboutus",
        components: {
          aboutus: AboutUs
        }
      }
    ]
  }
];

const router = new IonicVueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
