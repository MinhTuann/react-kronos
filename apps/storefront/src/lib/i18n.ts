import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      header: {
        brands: "Brands",
        sell: "Sell Your Watch",
        magazine: "Magazine",
        history: "Kronos History",
        search: "Search...",
        contact: "Contact via Zalo",
        about: "About",
        home: "Home"
      },
      menu: {
        title: "Kronos Luxury Timepieces",
        discover: "DISCOVER",
        view: "VIEW",
        backToMenu: "Back to menu",
        backToBrands: "Back to brands",
        theBrands: "The Brands",
        theCompany: "The Company",
        newsEvents: "News & Events",
        all: "All"
      },
      search: {
        placeholder: "Search collections, models, or materials...",
        trending: "Trending Now",
        discover: "Discover"
      },
      footer: {
        rights: "All rights reserved",
        contact: "Contact us",
        follow: "Follow us",
        philosophy: "The Philosophy",
        philosophyText: "The pinnacle of horological artistry. Crafting timepieces that transcend generations through uncompromising precision and aesthetic mastery. Every movement is a testament to our heritage.",
        promise: "The Promise",
        promiseText: "To possess a Kronos is to hold eternity in the palm of your hand.",
        connect: "Connect",
        clientRelations: "Client Relations"
      },
      common: {
        explore: "Explore",
        exploreMore: "Explore More",
        view_details: "View Details",
        add_to_cart: "Add to Bag",
        contact_for_price: "Contact for Price",
        specifications: "Technical Specifications",
        caseSize: "Case Size",
        material: "Material",
        movement: "Movement",
        strap: "Strap/Bracelet",
        dial: "Dial",
        condition: "Condition",
        relatedProducts: "Related Products",
        contactUs: "Contact Us",
        discovery: "Discovery",
        specifics: "Specifics",
        availability: "Availability",
        delivery: "Delivery",
        in_stock: "In Stock",
        contact_boutiques: "Contact Boutiques",
        authenticity: "Authenticity Guaranteed",
        secure_payment: "Secure Payment",
        back_to_collections: "Back to Collections",
        delivery_time: "3-5 Business Days",
        load_more: "Load More",
        syncing: "SYNCING"
      },
      home: {
        latestArrivals: "Latest Arrivals",
        exploreCollections: "Explore Collections",
        inStockTitle: "In Stock",
        inStockSubtitle: "Discover our collection of watches in stock and ready to ship.",
        findYourWatch: "Find Your Watch"
      },
      collections: {
        title: "The Collection",
        subtitle: "Masterpieces",
        description: "Explore our exquisite range of timepieces, each representing the pinnacle of horological craftsmanship and timeless design.",
        showFilters: "Show Filters",
        hideFilters: "Hide Filters",
        filter: "Filter",
        applyFilters: "Apply Filters",
        previous: "Previous",
        next: "Next",
        watch_not_found: "Watch Not Found"
      },
      news: {
        title: "News & Events",
        subtitle: "The world’s premium brands in one place",
        viewAll: "View All News",
        readArticle: "Read Article"
      }
    }
  },
  vi: {
    translation: {
      header: {
        brands: "Thương hiệu",
        sell: "Ký Gửi & Thu Mua",
        magazine: "Tạp chí",
        history: "Lịch sử Kronos",
        search: "Tìm kiếm...",
        contact: "Liên hệ qua Zalo",
        about: "Về Kronos",
        home: "Trang chủ"
      },
      menu: {
        title: "Kronos Luxury Timepieces",
        discover: "KHÁM PHÁ",
        view: "XEM",
        backToMenu: "Quay lại",
        backToBrands: "Quay lại thương hiệu",
        theBrands: "Thương hiệu",
        theCompany: "Về chúng tôi",
        newsEvents: "Tin tức & Sự kiện",
        all: "Tất cả"
      },
      search: {
        placeholder: "Tìm kiếm bộ sưu tập, mẫu mã, chất liệu...",
        trending: "Xu hướng",
        discover: "Khám phá"
      },
      footer: {
        rights: "Đã đăng ký bản quyền",
        contact: "Liên hệ",
        follow: "Theo dõi chúng tôi",
        philosophy: "Triết lý",
        philosophyText: "Đỉnh cao của nghệ thuật chế tác đồng hồ. Tạo ra những kiệt tác vượt thời gian qua sự chính xác tuyệt đối và bậc thầy thẩm mỹ. Mỗi chuyển động là một minh chứng cho di sản của chúng tôi.",
        promise: "Lời hứa",
        promiseText: "Sở hữu một chiếc Kronos là nắm giữ sự vĩnh cửu trong lòng bàn tay.",
        connect: "Kết nối",
        clientRelations: "Quan hệ khách hàng"
      },
      common: {
        explore: "Khám phá",
        exploreMore: "Khám phá thêm",
        view_details: "Xem chi tiết",
        add_to_cart: "Thêm vào giỏ",
        contact_for_price: "Liên hệ để biết giá",
        specifications: "Thông số kỹ thuật",
        caseSize: "Kích thước",
        material: "Chất liệu",
        movement: "Bộ máy",
        strap: "Dây đeo",
        dial: "Mặt số",
        condition: "Tình trạng",
        relatedProducts: "Sản phẩm liên quan",
        contactUs: "Liên hệ",
        discovery: "Khám phá",
        specifics: "Chi tiết",
        availability: "Tình trạng hàng",
        delivery: "Giao hàng",
        in_stock: "Còn hàng",
        contact_boutiques: "Liên hệ cửa hàng",
        authenticity: "Đảm bảo chính hãng",
        secure_payment: "Thanh toán an toàn",
        back_to_collections: "Quay lại bộ sưu tập",
        delivery_time: "3-5 ngày làm việc",
        watch_not_found: "Không tìm thấy đồng hồ",
        load_more: "Xem Thêm",
        syncing: "ĐANG TẢI"
      },
      home: {
        latestArrivals: "Sản phẩm mới nhất",
        exploreCollections: "Khám phá bộ sưu tập",
        inStockTitle: "Đang có sẵn",
        inStockSubtitle: "Khám phá bộ sưu tập đồng hồ đang có sẵn và sẵn sàng giao ngay.",
        findYourWatch: "Tìm chiếc đồng hồ của bạn"
      },
      collections: {
        title: "Bộ Sưu Tập",
        subtitle: "Kiệt tác",
        description: "Khám phá dòng sản phẩm đồng hồ tinh xảo của chúng tôi, mỗi chiếc đều đại diện cho đỉnh cao của nghệ thuật chế tác và thiết kế vượt thời gian.",
        showFilters: "Hiện bộ lọc",
        hideFilters: "Ẩn bộ lọc",
        filter: "Bộ lọc",
        applyFilters: "Áp dụng",
        previous: "Trước",
        next: "Tiếp",
        watch_not_found: "Không tìm thấy đồng hồ"
      },
      news: {
        title: "Tin tức & Sự kiện",
        subtitle: "Những thương hiệu cao cấp nhất thế giới tụ hội",
        viewAll: "Xem tất cả tin tức",
        readArticle: "Đọc bài viết"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
