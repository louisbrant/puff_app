import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')
export const LAYOUT = {
  window: { width, height },
  header: { headerShown: false },
  googleMapsApiKey: 'AIzaSyBQjTfzE_m26y8-jSYTVPvwbkuebEUOCTM',
  LATITUDE_DELTA: 0.1,
  LONGITUDE_DELTA: 0.1,
  Search: ['Hybrid', 'Sativa', 'Indica', 'Clear'],
  MapSearch: ['50 miles', '100 miles', '200 miles', 'Clear'],
  StrainDetails: [
    { label: 'Strain Details', value: '' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Sativa', value: 'Sativa' },
    { label: 'Indica', value: 'Indica' },
  ],
  StrainGuide: [
    { label: 'Strain Guide', value: '' },
    { label: 'Flower', value: 'Flower' },
    { label: 'Concentrate', value: 'Concentrate' },
    { label: 'Topical', value: 'Topical' },
    { label: 'Tincture', value: 'Tincture' },
    { label: 'Edible', value: 'Edible' },
  ],
  StrainUnit: [
    { label: 'mg', value: 'mg' },
    { label: '%', value: '%' },
  ],
  product: ["Sweet", "Spicy", "Sour", "Bitter", "Sharp", "Fruity", "Lemon", "Orange", "Fresh", "Burnt", "Floral", "Creamy", "Blueberry", "Chemicals", "Garlic", "Cherry", "Apple", "Apricot", "Lime", "Bready", "Grapefruit", "Berries", "Tropical", "Mango", "Strawberry", "Melon", "Guava", "Peppery", "Green", "Piney", "Clove", "Candy", "Tart", "Vanilla", "Grape", "Pineapple", "TreeFruit"],
  BUTTONS: ["Directly Launch Camera", "Directly Launch Image Library"],
  Warning: ["Warning: Can't perform", 'VirtualizedLists should ', 'Setting a timer', 'window.navigator', 'Permission denied', '@firebase/database:', 'Invalid prop `listViewDisplayed`', 'Warning: `flexWrap: `wrap`'],
  headerOption: {
    headerShown: false,
    animationEnabled: false
  },
  bottomOptionVisible: {
    title: () => null,
    tabBarButton: () => null
  },
  bottomOption: {
    title: () => null,
    tabBarVisible: false,
    tabBarButton: () => null
  },
  paymentSuccess: 'http://capp.strandwebsites.com/contractor_app/payment/success',
  paymentError: 'http://capp.strandwebsites.com/contractor_app/payment/error',
  paypalClientID: "Ab_sua-SGgIfvonJICzjNwSfx9aCVhgNSYYD9C3PSEbg6LL5AEJybTSTxcajm58OLGEjAfVnui6VHq1E",
  paypalSecret: "EO54heHy-JMe9jF1XiKTabbT_34H72QwGJY8U4H-IGl3felAOhbx-z2tPfLK9nRzEOMGiEt_iX2Qu3e7",
}