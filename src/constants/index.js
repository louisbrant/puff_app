import { StyleSheet } from "react-native"
import normalize from 'react-native-normalize'
import { COLOR } from "./Color"
import { LAYOUT } from "./Layout"
export * from './Color'
export * from './Images'
export * from './Layout'
export * from './firebase'

export const Styles = StyleSheet.create({
    userState: {
        position: 'absolute',
        fontSize: normalize(10),
        bottom: normalize(9),
        right: normalize(9)
    },
    userState1: {
        position: 'absolute',
        fontSize: normalize(12),
        bottom: normalize(12),
        right: normalize(12)
    },
    friendImage: {
        width: '100%',
        height: '100%',
    },
    friendCover: {
        overflow: 'hidden',
        borderRadius: normalize(28),
        width: normalize(56),
        height: normalize(56),
    },
    //=====================modal========================== 
    modalCenteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalView: {
        width: LAYOUT.window.width * 0.75,
        paddingHorizontal: normalize(30),
        paddingVertical: normalize(30),
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5
    },
    modalText: {
        fontWeight: '400',
        textAlign: 'center',
        fontSize: normalize(18),
        color: COLOR.blackColor
    },
    modalSuccessIcon: {
        width: normalize(70),
        height: normalize(70),
        resizeMode: 'contain'
    },
    modalSuccessIcon1: {
        width: normalize(30),
        height: normalize(30),
        resizeMode: 'contain'
    },
    Radius5: {
        borderRadius: 5
    },
    //=====================modal==========================    
    //=====================header==========================    
    headerInputGroup: {
        padding: normalize(10),
        marginBottom: normalize(10),
        flex: 1,
        backgroundColor: COLOR.whiteColor,
        borderRadius: 4,
        elevation: 2,
    },
    header: {
        backgroundColor: COLOR.HeaderColor,
        height: normalize(60),
    },
    //=====================header==========================    

    titleCover: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingVertical: normalize(15),
    },
    ImageBackgroundOt: {
        width: '100%',
        height: '100%',
    },
    label: {
        color: COLOR.whiteColor,
        fontSize: normalize(15)
    },
    logo1: {
        height: normalize(100, 'height'),
        width: normalize(200),
        resizeMode: 'contain',
        alignItems: 'center',
    },
    avatar: {
        height: normalize(90),
        width: normalize(90),
        borderRadius: normalize(45),
        resizeMode: 'contain',
        alignItems: 'center',
        overflow: 'hidden'
    },
    avatar1: {
        height: normalize(80),
        width: normalize(80),
        borderRadius: normalize(45),
        resizeMode: 'contain',
        alignItems: 'center',
        overflow: 'hidden'
    },
    Border: {
        height: normalize(100, 'height'),
        width: normalize(200),
        resizeMode: 'contain',
        flex: 1,
        alignItems: 'center',
    },
    Header: {
        backgroundColor: COLOR.HeaderColor,
        height: normalize(60),
        flexDirection: 'column',
        shadowOffset: { width: 0, height: 5 },
        shadowColor: COLOR.greyColor,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 2
    },
    footer: {
        backgroundColor: "rgba(255,255,255,.1)",
        height: normalize(56),
    },
    footerTab: {
        marginTop: normalize(6.5),
        height: normalize(50),
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 1,
        borderRadius: 0,
        shadowColor: "rgba(255,255,255,.1)",
        backgroundColor: COLOR.standard,
    },
    footerIcon: {
        height: normalize(33),
        width: normalize(32),
        resizeMode: 'contain'
    },
    settingIcon: {
        height: normalize(35),
        width: normalize(35),
        resizeMode: 'contain'
    },
    sureIcon: {
        height: normalize(18),
        width: normalize(18),
        resizeMode: 'contain'
    },
    icons: {
        width: normalize(55),
        height: normalize(55),
        resizeMode: 'contain'
    },
    photos: {
        width: LAYOUT.window.width * 0.28,
        height: LAYOUT.window.width * 0.28,
        resizeMode: 'contain'
    },
    round_demo: {
        width: normalize(60),
        height: normalize(60),
        borderRadius: normalize(30)
    },
    infoIcon: {
        width: normalize(65),
        height: normalize(65),
        resizeMode: 'contain'
    },
    productIcon: {
        width: LAYOUT.window.width * 0.2,
        height: LAYOUT.window.width * 0.2,
        resizeMode: 'contain'
    },
    wishIcon: {
        width: LAYOUT.window.width * 0.15,
        height: LAYOUT.window.width * 0.15,
        resizeMode: 'contain'
    },
    carIcon: {
        width: normalize(20),
        height: normalize(20),
        resizeMode: 'contain'
    },
    rate: {
        height: normalize(20),
        width: normalize(20),
        resizeMode: 'contain'
    },
    searchIcons: {
        height: normalize(35),
        width: normalize(35),
        resizeMode: 'contain'
    },

    textA: {
        textAlign: 'center',
        color: COLOR.whiteColor,
        fontSize: normalize(18)
    },
    BoxShadow: {
        shadowOffset: { width: 2, height: 3 },
        shadowColor: COLOR.greyColor,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 3,
    },
    TDL: {
        textDecorationLine: 'underline'
    },

    Hidden: {
        overflow: 'hidden'
    },



    //=====================================Align====================================
    Tcenter: {
        textAlign: 'center'
    },
    Tleft: {
        textAlign: 'left'
    },
    Tright: {
        textAlign: 'right'
    },
    ROW: {
        flexDirection: 'row'
    },
    Wrap: {
        flexWrap: 'wrap'
    },
    Jaround: {
        justifyContent: 'space-around'
    },
    Jbetween: {
        justifyContent: 'space-between'
    },
    Jcenter: {
        justifyContent: 'center'
    },
    Jstart: {
        justifyContent: 'flex-start'
    },
    Jend: {
        justifyContent: 'flex-end'
    },
    Ascenter: {
        alignSelf: 'center'
    },
    Acenter: {
        alignItems: 'center'
    },
    Astart: {
        alignItems: 'flex-start'
    },
    Aend: {
        alignItems: 'flex-end'
    },

    PABS: {
        position: 'absolute'
    },
    //=====================================Align====================================
    //=====================================fontWeight====================================
    FW400: {
        fontWeight: '400'
    },
    FW700: {
        fontWeight: '700'
    },
    FWBold: {
        fontWeight: 'bold'
    },
    //=====================================fontWeight====================================


    //=====================================fontSize====================================
    F13: {
        fontSize: normalize(13)
    },
    F14: {
        fontSize: normalize(14)
    },
    F15: {
        fontSize: normalize(15)
    },
    F16: {
        fontSize: normalize(16)
    },
    F17: {
        fontSize: normalize(17)
    },
    F18: {
        fontSize: normalize(18)
    },
    F19: {
        fontSize: normalize(19)
    },
    F20: {
        fontSize: normalize(20)
    },
    F21: {
        fontSize: normalize(21)
    },
    F22: {
        fontSize: normalize(22)
    },
    F23: {
        fontSize: normalize(23)
    },
    F24: {
        fontSize: normalize(24)
    },
    F25: {
        fontSize: normalize(25)
    },
    F26: {
        fontSize: normalize(26)
    },
    F27: {
        fontSize: normalize(27)
    },
    F28: {
        fontSize: normalize(28)
    },
    F30: {
        fontSize: normalize(30)
    },
    F35: {
        fontSize: normalize(35)
    },
    F40: {
        fontSize: normalize(40)
    },
    F70: {
        fontSize: normalize(70)
    },
    //=====================================fontSize====================================


    //=====================================margin====================================
    M0: {
        margin: 0
    },
    M5: {
        margin: normalize(5)
    },
    M10: {
        margin: normalize(10)
    },
    M20: {
        margin: normalize(20)
    },
    M30: {
        margin: normalize(30)
    },
    M40: {
        margin: normalize(40)
    },
    M50: {
        margin: normalize(50)
    },

    MT5: {
        marginTop: normalize(5)
    },
    MT10: {
        marginTop: normalize(10)
    },
    MT15: {
        marginTop: normalize(15)
    },
    MT20: {
        marginTop: normalize(20)
    },
    MT30: {
        marginTop: normalize(30)
    },
    MT40: {
        marginTop: normalize(40)
    },
    MT50: {
        marginTop: normalize(50)
    },
    MT70: {
        marginTop: normalize(70)
    },

    MB10: {
        marginBottom: normalize(10)
    },
    MB20: {
        marginBottom: normalize(20)
    },
    MB30: {
        marginBottom: normalize(30)
    },
    MB40: {
        marginBottom: normalize(40)
    },
    MB50: {
        marginBottom: normalize(50)
    },
    MB60: {
        marginBottom: normalize(60)
    },
    MB70: {
        marginBottom: normalize(70)
    },

    MV5: {
        marginVertical: normalize(5)
    },
    MV10: {
        marginVertical: normalize(10)
    },
    MV10: {
        marginVertical: normalize(10)
    },
    MV15: {
        marginVertical: normalize(15)
    },
    MV20: {
        marginVertical: normalize(20)
    },
    MV30: {
        marginVertical: normalize(30)
    },
    MV40: {
        marginVertical: normalize(40)
    },
    MV50: {
        marginVertical: normalize(50)
    },

    MH5: {
        marginHorizontal: normalize(5)
    },
    MH10: {
        marginHorizontal: normalize(10)
    },
    MH20: {
        marginHorizontal: normalize(20)
    },
    MH30: {
        marginHorizontal: normalize(30)
    },
    MH40: {
        marginHorizontal: normalize(40)
    },
    MH50: {
        marginHorizontal: normalize(50)
    },

    MR10: {
        marginRight: normalize(10)
    },
    MR20: {
        marginRight: normalize(20)
    },
    MR30: {
        marginRight: normalize(30)
    },
    MR40: {
        marginRight: normalize(40)
    },
    MR50: {
        marginRight: normalize(50)
    },

    ML5: {
        marginLeft: normalize(5)
    },
    ML10: {
        marginLeft: normalize(10)
    },
    ML15: {
        marginLeft: normalize(15)
    },
    ML20: {
        marginLeft: normalize(20)
    },
    ML30: {
        marginLeft: normalize(30)
    },
    ML40: {
        marginLeft: normalize(40)
    },
    ML50: {
        marginLeft: normalize(50)
    },
    //=====================================margin====================================


    //=====================================padding====================================
    P5: {
        padding: normalize(5)
    },
    P10: {
        padding: normalize(10)
    },
    P20: {
        padding: normalize(20)
    },
    P30: {
        padding: normalize(30)
    },

    PT5: {
        paddingTop: normalize(5)
    },
    PT10: {
        paddingTop: normalize(10)
    },
    PT15: {
        paddingTop: normalize(15)
    },
    PT20: {
        paddingTop: normalize(20)
    },
    PT25: {
        paddingTop: normalize(25)
    },
    PT30: {
        paddingTop: normalize(30)
    },
    PT40: {
        paddingTop: normalize(40)
    },
    PT50: {
        paddingTop: normalize(50)
    },

    PB10: {
        paddingBottom: normalize(10)
    },
    PB20: {
        paddingBottom: normalize(20)
    },
    PB30: {
        paddingBottom: normalize(30)
    },
    PB40: {
        paddingBottom: normalize(40)
    },
    PB50: {
        paddingBottom: normalize(50)
    },

    PL5: {
        paddingLeft: normalize(5)
    },
    PL10: {
        paddingLeft: normalize(10)
    },
    PL20: {
        paddingLeft: normalize(20)
    },
    PL25: {
        paddingLeft: normalize(25)
    },
    PL30: {
        paddingLeft: normalize(30)
    },

    PR10: {
        paddingRight: normalize(10)
    },
    PR20: {
        paddingRight: normalize(20)
    },
    PR50: {
        paddingRight: normalize(50)
    },

    PV5: {
        paddingVertical: normalize(5)
    },
    PV10: {
        paddingVertical: normalize(10)
    },
    PV15: {
        paddingVertical: normalize(15)
    },
    PV20: {
        paddingVertical: normalize(20)
    },

    PH5: {
        paddingHorizontal: normalize(5)
    },
    PH10: {
        paddingHorizontal: normalize(10)
    },
    PH15: {
        paddingHorizontal: normalize(15)
    },
    PH20: {
        paddingHorizontal: normalize(20)
    },
    PH30: {
        paddingHorizontal: normalize(30)
    },
    PH40: {
        paddingHorizontal: normalize(40)
    },
    PH50: {
        paddingHorizontal: normalize(50)
    },
    //=====================================padding====================================

    //=====================================height====================================
    H30: {
        height: normalize(30)
    },
    H40: {
        height: normalize(40)
    },
    H50: {
        height: normalize(50)
    },
    H55: {
        height: normalize(55)
    },
    H100: {
        height: normalize(100)
    },
    H200: {
        height: normalize(200)
    },
    H100P: {
        height: '100%'
    },
    //=====================================height====================================

    //=====================================width====================================
    W25P: {
        width: '25%'
    },
    W33P: {
        width: '33.33%'
    },
    W50P: {
        width: '50%'
    },
    W75P: {
        width: '75%'
    },
    W90P: {
        width: '90%'
    },
    W100P: {
        width: '100%'
    },
    //=====================================width====================================


    //=====================================color====================================
    CLSuccess: {
        color: COLOR.success
    },
    CLDanger: {
        color: COLOR.danger
    },
    CLPrimary: {
        color: COLOR.primary
    },
    CLWarning: {
        color: COLOR.warning
    },
    CLinfo: {
        color: COLOR.info
    },
    CLLight: {
        color: COLOR.light
    },

    CLHeader: {
        color: COLOR.HeaderColor
    },
    CLBorder: {
        color: COLOR.BorderColor
    },
    CLIcon: {
        color: COLOR.IconColor
    },
    CLText: {
        color: COLOR.TextColor
    },

    CLW: {
        color: COLOR.whiteColor
    },
    CLB: {
        color: COLOR.blackColor
    },
    CLG: {
        color: COLOR.greenColor
    },
    CLGY: {
        color: COLOR.greyColor
    },
    //=====================================color====================================


    //=====================================backgroundColor====================================
    BKSuccess: {
        backgroundColor: COLOR.success
    },
    BKDanger: {
        backgroundColor: COLOR.danger
    },
    BKPrimary: {
        backgroundColor: COLOR.primary
    },
    BKWarning: {
        backgroundColor: COLOR.warning
    },
    BKinfo: {
        backgroundColor: COLOR.info
    },
    BKLight: {
        backgroundColor: COLOR.light
    },
    BKHeader: {
        backgroundColor: COLOR.HeaderColor
    },

    BKW: {
        backgroundColor: COLOR.whiteColor
    },
    BKBase: {
        backgroundColor: COLOR.BaseBackground
    },
    BKG: {
        backgroundColor: COLOR.green1Color
    },
    BKG1: {
        backgroundColor: COLOR.green2Color
    },
    BKLGY: {
        backgroundColor: COLOR.greyColor
    },
    BKGrey: {
        backgroundColor: COLOR.greyColor
    },
    BKBule: {
        backgroundColor: COLOR.blueColor
    },
    //=====================================backgroundColor====================================
})