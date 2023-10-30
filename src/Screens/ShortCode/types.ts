declare module namespace {

    export interface Source {
        proxy_url: string;
        image_path: string;
        image_fit: string;
        original?: any;
    }

    export interface VerifyDetails {
        is_email_verified: number;
        is_phone_verified: number;
    }

    export interface ClientPreference {
        theme_admin: string;
        distance_unit: string;
        map_provider: number;
        date_format: string;
        time_format: string;
        map_key: string;
        sms_provider: number;
        verify_email: number;
        verify_phone: number;
        app_template_id: number;
        web_template_id: number;
    }

    export interface UserData {
        id: number;
        name: string;
        email: string;
        auth_token: string;
        source: Source;
        verify_details: VerifyDetails;
        is_admin: number;
        is_superadmin: number;
        client_preference: ClientPreference;
        dial_code: string;
        phone_number: string;
        cca2: string;
        callingCode: number;
        refferal_code: string;
        user_document: any[];
    }

    export interface ProfileAddress {
    }

    export interface Auth {
        userData: UserData;
        profileAddress: ProfileAddress;
        isSkip: boolean;
        isVideoSplash: boolean;
        appSessionInfo: string;
    }

    export interface ThemeColors {
        themeMain: string;
        themeOpacity20: string;
        headingColor: string;
        textGrey: string;
        textGreyLight: string;
        bottomBarGradientA: string;
        bottomBarGradientB: string;
        backgroundGrey: string;
        currencyRed: string;
    }

    export interface ThemeLayouts {
    }

    export interface AppTheme {
        themeColors: ThemeColors;
        themeLayouts: ThemeLayouts;
    }

    export interface ThemeColors2 {
        themeMain: string;
        themeOpacity20: string;
        headingColor: string;
        textGrey: string;
        textGreyLight: string;
        bottomBarGradientA: string;
        bottomBarGradientB: string;
        backgroundGrey: string;
        currencyRed: string;
        primary_color: string;
        secondary_color: string;
    }

    export interface ThemeLayouts2 {
    }

    export interface Logo {
        proxy_url: string;
        image_path: string;
        image_fit: string;
        original: string;
        logo_db_value: string;
    }

    export interface DarkLogo {
        proxy_url: string;
        image_path: string;
        image_fit: string;
        original: string;
        logo_db_value?: any;
    }

    export interface VendorMode {
        name: string;
        icon: string;
        type: string;
    }

    export interface Preferences {
        business_type: string;
        theme_admin: string;
        client_code: string;
        distance_unit: string;
        currency_id?: any;
        dinein_check: number;
        takeaway_check: number;
        delivery_check: number;
        date_format: string;
        time_format: string;
        fb_login: number;
        twitter_login: number;
        google_login: number;
        apple_login: number;
        map_provider: number;
        app_template_id: number;
        is_hyperlocal: number;
        verify_email: number;
        verify_phone: number;
        primary_color: string;
        secondary_color: string;
        map_key: string;
        pharmacy_check: number;
        celebrity_check: number;
        enquire_mode: number;
        subscription_mode: number;
        site_top_header_color: string;
        tip_before_order: number;
        tip_after_order: number;
        off_scheduling_at_cart: number;
        delay_order: number;
        product_order_form: number;
        gifting: number;
        pickup_delivery_service_area: number;
        customer_support: string;
        customer_support_key?: any;
        customer_support_application_id?: any;
        android_app_link?: any;
        ios_link?: any;
        minimum_order_batch: number;
        static_delivey_fee: number;
        max_safety_mod: number;
        digit_after_decimal: number;
        auto_implement_5_percent_tip: number;
        book_for_friend: number;
        sos: number;
        sos_police_contact?: any;
        sos_ambulance_contact?: any;
        get_estimations: number;
        is_static_dropoff: number;
        rental_check: number;
        pick_drop_check: number;
        on_demand_check: number;
        laundry_check: number;
        appointment_check: number;
        stop_order_acceptance_for_users: number;
        distance_unit_for_time: string;
        p2p_check: number;
        is_cancel_order_user: number;
        regular_font: string;
        medium_font: string;
        bold_font: string;
        tertiary_color: string;
        tab_bar_style: number;
        home_page_style: number;
        home_tag_line: string;
        vendorMode: VendorMode[];
        advance_booking_amount: number;
        advance_booking_amount_percentage: number;
        update_order_product_price: boolean;
        is_cab_pooling: number;
        chat_button: number;
        call_button: number;
        delivery_nomenclature: string;
        dinein_nomenclature: string;
        takeaway_nomenclature: string;
        search_nomenclature: string;
        vendors_nomenclature: string;
        sellers_nomenclature: string;
        fixed_fee_nomenclature: string;
        want_to_tip_nomenclature: string;
        referral_code: string;
        passbase_check: number;
        is_postpay_enable: number;
        is_order_edit_enable: number;
    }

    export interface Country {
        id: number;
        name: string;
        code: string;
        phonecode: number;
    }

    export interface Profile {
        id: number;
        country_id: number;
        company_name: string;
        code: string;
        sub_domain: string;
        database_name: string;
        logo: Logo;
        dark_logo: DarkLogo;
        company_address: string;
        phone_number: string;
        email: string;
        custom_domain: string;
        contact_phone_number?: any;
        socket_url?: any;
        preferences: Preferences;
        country: Country;
    }

    export interface Language2 {
        id: number;
        name: string;
        sort_code: string;
        nativeName: string;
    }

    export interface Language {
        language_id: number;
        is_primary: number;
        language: Language2;
    }

    export interface Currency2 {
        id: number;
        name: string;
        iso_code: string;
        symbol: string;
    }

    export interface Currency {
        currency_id: number;
        is_primary: number;
        doller_compare: string;
        currency: Currency2;
    }

    export interface AppData {
        profile: Profile;
        languages: Language[];
        banners: any[];
        mobile_banners: any[];
        currencies: Currency[];
        dynamic_tutorial: any[];
        domain_link: string;
    }

    export interface AllCurrency {
        id: number;
        label: string;
        value: string;
        symbol: string;
        iso_code: string;
    }

    export interface PrimaryCurrency {
        id: number;
        name: string;
        iso_code: string;
        symbol: string;
    }

    export interface Currencies {
        all_currencies: AllCurrency[];
        primary_currency: PrimaryCurrency;
    }

    export interface AllLanguage {
        id: number;
        label: string;
        value: string;
        sort_code: string;
    }

    export interface PrimaryLanguage {
        id: number;
        name: string;
        sort_code: string;
        nativeName: string;
    }

    export interface Languages {
        all_languages: AllLanguage[];
        primary_language: PrimaryLanguage;
    }

    export interface FontSizeData {
        regular: string;
        medium: string;
        bold: string;
    }

    export interface AppStyle {
        fontSizeData: FontSizeData;
        tabBarLayout: number;
        homePageLayout: number;
    }

    export interface ThemeToggle {
    }

    export interface InitBoot {
        themeColors: ThemeColors2;
        themeLayouts: ThemeLayouts2;
        appData: AppData;
        currencies: Currencies;
        languages: Languages;
        allAddresss: any[];
        shortCodeStatus: string;
        appStyle: AppStyle;
        themeColor: boolean;
        themeToggle: ThemeToggle;
        searchText: any[];
        redirectedFrom: string;
        deeplinkUrl: string;
        internetConnection: boolean;
    }

    export interface AppMainData {
    }

    export interface Location {
        address: string;
        latitude: number;
        longitude: number;
    }

    export interface ProfileAddress2 {
        addAddress: string;
        updatedAddress: string;
    }

    export interface ConstCurrLoc {
        address: string;
        latitude: string;
        longitude: string;
    }

    export interface Home {
        appMainData: AppMainData;
        location: Location;
        profileAddress: ProfileAddress2;
        dineInType: string;
        constCurrLoc: ConstCurrLoc;
        pickUpTimeType: string;
        isLocationSearched: boolean;
    }

    export interface CategoryData {
    }

    export interface Vendor {
        categoryData: CategoryData;
    }

    export interface ProductDetailData {
    }

    export interface Product {
        productListData: any[];
        productDetailData: ProductDetailData;
        walletData?: any;
    }

    export interface CartItemCount {
        status: string;
        message?: any;
        data?: any;
    }

    export interface Cart {
        cartItemCount: CartItemCount;
        selectedAddress?: any;
    }

    export interface CarData {
    }

    export interface Pickupdelivery {
        carData: CarData;
    }

    export interface StoreSelectedVendor {
    }

    export interface Order {
        storeSelectedVendor: StoreSelectedVendor;
    }

    export interface PendingNotifications {
        pendingNotifications: any[];
        isVendorNotification: boolean;
        refreshNotificationId?: any;
    }

    export interface AddressSearch {
        addressSearch: boolean;
    }

    export interface ReloadData {
        reloadData: boolean;
    }

    export interface ChatRefresh {
        isChatRefresh: boolean;
    }

    export interface RootObject {
        auth: Auth;
        appTheme: AppTheme;
        initBoot: InitBoot;
        home: Home;
        vendor: Vendor;
        product: Product;
        cart: Cart;
        pickupdelivery: Pickupdelivery;
        order: Order;
        pendingNotifications: PendingNotifications;
        addressSearch: AddressSearch;
        reloadData: ReloadData;
        chatRefresh: ChatRefresh;
    }

}

