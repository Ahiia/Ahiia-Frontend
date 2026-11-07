import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Building2,
  Sparkles,
  BarChart3,
  CreditCard,
  Settings,
  Headphones,
  CheckCircle2,
  FileText,
  Download,
  Copy,
  Trash2,
  X,
} from "lucide-react";
import { useCookies } from "react-cookie";
import { getUserProfile } from "../../services/profile.service";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  removeNotification,
  clearAllNotifications,
  formatNotificationTime,
  NOTIFICATION_EVENT,
} from "../../services/notification.service";
import logo from "../../assets/ahiia_icon.svg";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/dashboard/": "Dashboard",
  "/dashboard/overview": "Dashboard",
  "/dashboard/documents": "Documents",
  "/dashboard/create-document": "Create Document",
  "/dashboard/analytics": "Analytics",
  "/dashboard/company-profile": "Company Profile",
  "/dashboard/brand-kit": "Brand Kit",
  "/dashboard/billing": "Plans & Billing",
  "/dashboard/settings": "Settings",
  "/dashboard/help": "Help & Support",
  // Admin route titles
  "/admin": "Admin Dashboard",
  "/admin/overview": "Admin Overview",
  "/admin/users": "User Management",
  "/admin/verifications": "Verifications",
  "/admin/templates": "Templates",
  "/admin/analytics": "Platform Analytics",
  "/admin/settings": "Admin Settings",
};

const NOTIFICATION_ICON_CONFIG = {
  document_created: {
    icon: CheckCircle2,
    tint: "bg-emerald-50 text-emerald-600",
  },
  document_exported: {
    icon: Download,
    tint: "bg-indigo-50 text-indigo-600",
  },
  document_saved: {
    icon: FileText,
    tint: "bg-blue-50 text-blue-600",
  },
  ai_edit: {
    icon: Sparkles,
    tint: "bg-violet-50 text-violet-600",
  },
  brand_kit: {
    icon: Sparkles,
    tint: "bg-blue-50 text-blue-600",
  },
  profile_updated: {
    icon: Building2,
    tint: "bg-emerald-50 text-emerald-600",
  },
  document_duplicated: {
    icon: Copy,
    tint: "bg-sky-50 text-sky-600",
  },
  document_deleted: {
    icon: Trash2,
    tint: "bg-rose-50 text-rose-600",
  },
};

const DashboardHeader = ({ titleOverride, profile = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["accessToken", "refreshToken"]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [notifications, setNotifications] = useState(() => getNotifications());
  const [, setTimeTick] = useState(0);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Derive current title
  const currentTitle =
    titleOverride ||
    PAGE_TITLES[location.pathname] ||
    PAGE_TITLES[location.pathname.replace(/\/$/, "")] ||
    "Dashboard";

  // Sync live dashboard notifications & refresh relative timestamps
  useEffect(() => {
    setNotifications(getNotifications());

    const handleNotificationsChanged = (event) => {
      if (Array.isArray(event?.detail)) {
        setNotifications(event.detail);
      } else {
        setNotifications(getNotifications());
      }
    };

    const handleStorage = (event) => {
      if (event.key === "ahiia_dashboard_notifications") {
        setNotifications(getNotifications());
      }
    };

    window.addEventListener(NOTIFICATION_EVENT, handleNotificationsChanged);
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      setTimeTick((t) => t + 1);
    }, 30000);

    return () => {
      window.removeEventListener(
        NOTIFICATION_EVENT,
        handleNotificationsChanged
      );
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Fetch or listen for updated profile data
  useEffect(() => {
    let isMounted = true;
    const fetchHeaderProfile = async () => {
      try {
        const response = await getUserProfile();
        const data = response?.companyName
          ? response
          : response?.data || response;
        if (isMounted && data?.companyName) {
          setProfileData(data);
        }
      } catch (err) {
        console.warn("Could not fetch header profile:", err);
      }
    };

    fetchHeaderProfile();

    const handleProfileUpdated = (event) => {
      if (event?.detail) {
        setProfileData(event.detail);
      } else {
        fetchHeaderProfile();
      }
    };

    window.addEventListener("ahiia:profile-updated", handleProfileUpdated);
    return () => {
      isMounted = false;
      window.removeEventListener("ahiia:profile-updated", handleProfileUpdated);
    };
  }, []);

  const companyName =
    profileData?.companyName ||
    profile?.company ||
    profile?.companyName ||
    "Your Company";
  const logoUrl = profileData?.logoUrl || profile?.logoUrl;
  const industry = profileData?.industry || profile?.industry;
  const completeness =
    profileData?.completenessPercent ?? profile?.completenessPercent;

  const initials = companyName
    ? companyName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "YC";

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeCookie("accessToken", { path: "/" });
    removeCookie("refreshToken", { path: "/" });
    navigate("/login");
  };

  const handleNotificationClick = (item) => {
    markNotificationRead(item.id);
    if (item.link) {
      setShowNotifications(false);
      navigate(item.link);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-[#F4F6FA]/90 backdrop-blur-md px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/50">
      {/* Left section: Mobile Brand Badge (no sidebar click) + Dynamic Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Link
          to="/dashboard"
          className="lg:hidden w-9 h-9 rounded-xl bg-[#0F1738] flex items-center justify-center p-1.5 shadow-xs shrink-0 transition-transform active:scale-95"
          aria-label="AHIIA.Ai Home"
        >
          <img src={logo} alt="AHIIA.Ai" className="w-5 h-5 object-contain" />
        </Link>

        <h1 className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 truncate">
          {currentTitle}
        </h1>
      </div>

      {/* Middle section: Search Bar */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6 hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Right section: Notifications + Profile badge */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-xs transition-all active:scale-95 relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white shadow-2xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="fixed inset-x-3 top-[4.25rem] sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-88 bg-white border border-slate-100 rounded-2xl shadow-xl py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="flex items-center gap-2.5">
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsRead()}
                        className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => clearAllNotifications()}
                      className="text-xs text-slate-400 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto mb-2.5">
                    <Bell className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-700">
                    No activity notifications yet
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    When you create, edit, or export a document, or update your Brand Kit, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="py-1.5 space-y-1 max-h-72 overflow-y-auto">
                  {notifications.map((item) => {
                    const cfg =
                      NOTIFICATION_ICON_CONFIG[item.type] ||
                      NOTIFICATION_ICON_CONFIG.document_created;
                    const IconComponent = cfg.icon;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`group p-2.5 rounded-xl transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
                          item.read
                            ? "hover:bg-slate-50 opacity-80"
                            : "bg-blue-50/35 hover:bg-blue-50/60"
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${cfg.tint}`}
                          >
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {item.title}
                              </p>
                              {!item.read && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                              {item.message}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {formatNotificationTime(item.createdAt)}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(item.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all shrink-0"
                          aria-label="Dismiss notification"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Pill Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 py-1.5 pl-1.5 pr-2.5 sm:pl-2 sm:pr-3.5 bg-[#0F1738] hover:bg-[#16214C] text-white rounded-full shadow-xs transition-colors group cursor-pointer"
            aria-label="User menu"
          >
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 text-white flex items-center justify-center font-bold text-[10px] sm:text-[11px] tracking-wider shrink-0 overflow-hidden">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <span className="text-xs font-semibold tracking-tight hidden md:inline-block max-w-[130px] truncate">
              {companyName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
          </button>

          {/* Profile menu popup */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {companyName}
                  </p>
                  {completeness !== undefined && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
                      {completeness}% complete
                    </span>
                  )}
                </div>
                {industry && (
                  <p className="text-[11px] text-indigo-600 font-semibold truncate mt-0.5">
                    {industry}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/company-profile");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Building2 className="w-4 h-4 text-slate-400" />
                Company Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/brand-kit");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-slate-400" />
                Brand Kit
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/analytics");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <BarChart3 className="w-4 h-4 text-slate-400" />
                Analytics
              </button>

              <div className="my-1 border-t border-slate-100" />
              <div className="px-3 pt-1 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Account & Support
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/billing");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <CreditCard className="w-4 h-4 text-slate-400" />
                Plans & Billing
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/settings");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/dashboard/help");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors text-left"
              >
                <Headphones className="w-4 h-4 text-slate-400" />
                Help & Support
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
