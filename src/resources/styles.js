import { APP_BASE, APP_BLACK } from "./constants"


export default {
  modalView: {
    borderTopColor: APP_BASE,
    borderTopWidth: 40,
    height: '100%',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  listContainer: {
    borderBottomColor: '#d4d4d8',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10
  },

  /* NO INTERNET */
  noInternet: {
    backgroundColor: '#FECC29',
    opacity: 0.9,
    width: '100%',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 999
  },
  noInternetText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 25,
    color: APP_BLACK
  },
  noInternetSubText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: APP_BLACK
  },
  noInternetLogo: {
    marginTop: 40,
    width: 100,
    height: 75
  },
}