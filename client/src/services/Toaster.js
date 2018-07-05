import Vue from 'vue'
import Toasted from 'vue-toasted';
Vue.use(Toasted);
// options to the toast
let options = {
  type : 'error',
  icon : 'error_outline',
  position: "top-right", 
  duration : 5000,
  action : {
    text : 'close',
    onClick : (e, toastObject) => {
        toastObject.goAway(0);
    }
}
};

// register the toast with the custom message
Vue.toasted.register('my_app_error',
  (message) => {
      // clear all active toasters
      Vue.toasted.clear();
      // if there is no message passed show default message
      if(! message) {
          return "Oops.. Something Went Wrong.."
        }
      // if there is a message show it with the message
      return "Oops.. " + message;
  },
  options
)

export default {

    success (message) {
        options.icon  = 'error_outline';
        return Vue.toasted.success( message , options)
    },

    info (message) {
        options.icon  = 'error_outline';
        return Vue.toasted.info( message , options)
    }
}