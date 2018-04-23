import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:'grey'
  },
  modalContent: {
    shadowOpacity: 0.54,
    shadowRadius: 1,
    borderColor:'rgba(0,0,0,0.2)', 
    borderWidth: 1,
    backgroundColor:'white'
  },
  modalContent2: {
    shadowOpacity: 0.54,
    shadowRadius: 1,
    padding:15,
    borderColor:'rgba(0,0,0,0.2)', 
    borderWidth: 1,
    backgroundColor:'white'
  },
  vCard: {
    borderRadius: 2,
    padding: 8,
    margin: 8,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    minHeight: 76,
    shadowOpacity: 0.54,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  display: {
    paddingHorizontal: 8,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, .87)',
  },

  text: {
    padding: 8,
    fontSize: 15,
    color: 'rgba(0, 0, 0, .54)',
  },

  content: {
    flex: 1,
    paddingVertical: 16,
  },

  bold: {
    fontWeight: 'bold',
},
});