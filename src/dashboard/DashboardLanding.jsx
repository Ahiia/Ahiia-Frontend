import React, { useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import SideBar, {
  DEFAULT_USER_NAV_ITEMS,
  DEFAULT_USER_BOTTOM_NAV_ITEMS,
} from "./components/SideBar";
import DashboardHeader from "./components/DashboardHeader";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileStack,
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  FilePlus,
  Building2,
  Sparkles,
  CreditCard,
  Headphones,
  MoreHorizontal,
  ChevronRight,
  X,
} from "lucide-react";
import { getUserProfile } from "../services/profile.service";

export const ADMIN_NAV_ITEMS = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "User Management",
    to: "/admin/users",
    icon: Users,
  },
  {
    name: "Verifications",
    to: "/admin/verifications",
    icon: ShieldCheck,
  },
  {
    name: "Templates",
    to: "/admin/templates",
    icon: FileStack,
  },
  {
    name: "Analytics",
    to: "/admin/analytics",
    icon: BarChart3,
  },
];

export const ADMIN_BOTTOM_NAV_ITEMS = [
  {
    name: "Settings",
    to: "/admin/settings",
    icon: Settings,
  },
  {
    name: "Support Desk",
    to: "/admin/support",
    icon: HelpCircle,
  },
];

const MOBILE_USER_TABS = [
  {
    name: "Home",
    to: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
    matchPaths: ["/dashboard", "/dashboard/overview"],
  },
  {
    name: "Docs",
    to: "/dashboard/documents",
    icon: FileText,
    matchPaths: ["/dashboard/documents"],
  },
  {
    name: "Create",
    to: "/dashboard/create-document",
    icon: FilePlus,
    isPrimary: true,
    matchPaths: ["/dashboard/create-document"],
  },
  {
    name: "Brand Kit",
    to: "/dashboard/brand-kit",
    icon: Sparkles,
    matchPaths: ["/dashboard/brand-kit"],
  },
];

const MORE_MENU_PATHS = [
  "/dashboard/billing",
  "/dashboard/settings",
  "/dashboard/help",
  "/dashboard/company-profile",
  "/dashboard/analytics",
];

const ACCOUNT_SUPPORT_ITEMS = [
  {
    name: "Plans & Billing",
    subtitle: "Manage subscription, usage & invoices",
    to: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    subtitle: "Account preferences & security",
    to: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    subtitle: "Guides, FAQs & contact support",
    to: "/dashboard/help",
    icon: Headphones,
  },
];

const QUICK_WORKSPACE_ITEMS = [
  {
    name: "Company Profile",
    to: "/dashboard/company-profile",
    icon: Building2,
  },
  {
    name: "Analytics",
    to: "/dashboard/analytics",
    icon: BarChart3,
  },
];

const DashboardLanding = ({
  role = "user",
  customNavItems,
  customBottomNavItems,
  profile,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerTitle, setHeaderTitle] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isMoreSheetClosing, setIsMoreSheetClosing] = useState(false);
  const [clickedTabKey, setClickedTabKey] = useState(null);

  const triggerTabPop = useCallback((tabName) => {
    setClickedTabKey(`${tabName}-${Date.now()}`);
  }, []);

  const closeMoreSheet = useCallback(() => {
    if (!isMoreSheetOpen || isMoreSheetClosing) return;
    setIsMoreSheetClosing(true);
    setTimeout(() => {
      setIsMoreSheetOpen(false);
      setIsMoreSheetClosing(false);
    }, 185);
  }, [isMoreSheetOpen, isMoreSheetClosing]);

  const toggleMoreSheet = useCallback(() => {
    triggerTabPop("More");
    if (isMoreSheetOpen) {
      closeMoreSheet();
    } else {
      setIsMoreSheetClosing(false);
      setIsMoreSheetOpen(true);
    }
  }, [isMoreSheetOpen, closeMoreSheet, triggerTabPop]);

  const handleMoreNavigate = useCallback(
    (to) => {
      setIsMoreSheetClosing(true);
      setTimeout(() => {
        setIsMoreSheetOpen(false);
        setIsMoreSheetClosing(false);
        navigate(to);
      }, 160);
    },
    [navigate]
  );

  const fetchProfile = async () => {
    try {
      const response = await getUserProfile();
      const data = response?.companyName
        ? response
        : response?.data || response;
      if (data) {
        setUserProfile(data);
      }
    } catch (err) {
      console.error("DashboardLanding.fetchProfile", err);
    }
  };

  useEffect(() => {
    if (role === "user") {
      fetchProfile();
    }

    const handleProfileUpdated = (event) => {
      if (event?.detail) {
        setUserProfile(event.detail);
      } else {
        fetchProfile();
      }
    };

    window.addEventListener("ahiia:profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("ahiia:profile-updated", handleProfileUpdated);
    };
  }, [role]);

  // Determine nav items based on role or passed props
  const navItems =
    customNavItems ||
    (role === "admin" ? ADMIN_NAV_ITEMS : DEFAULT_USER_NAV_ITEMS);

  const bottomNavItems =
    customBottomNavItems ||
    (role === "admin"
      ? ADMIN_BOTTOM_NAV_ITEMS
      : DEFAULT_USER_BOTTOM_NAV_ITEMS);

  const companyName = userProfile?.companyName || "";
  const initials = companyName
    ? companyName
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "YC";

  const activeProfile =
    profile ||
    (role === "admin"
      ? {
          name: "Admin Portal",
          company: "Super Administrator",
          initials: "AD",
        }
      : {
          name: companyName || "Your Company",
          company: companyName || "Your Company",
          industry: userProfile?.industry || "Financial services",
          logoUrl: userProfile?.logoUrl || null,
          initials,
          completenessPercent: userProfile?.completenessPercent ?? 80,
          missingFields: userProfile?.missingFields || [],
        });

  const normalizedPath = location.pathname.replace(/\/$/, "") || "/";

  const isTabActive = (tab) => {
    if (tab.exact) {
      return tab.matchPaths.includes(normalizedPath);
    }
    return tab.matchPaths.some(
      (mp) => normalizedPath === mp || normalizedPath.startsWith(`${mp}/`)
    );
  };

  const isMoreRouteActive = MORE_MENU_PATHS.some(
    (mp) => normalizedPath === mp || normalizedPath.startsWith(`${mp}/`)
  );
  const isMoreActive =
    (isMoreSheetOpen && !isMoreSheetClosing) || isMoreRouteActive;

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-800 flex">
      {/* Desktop Sidebar Only (No mobile sidebar click) */}
      <SideBar
        navItems={navItems}
        bottomNavItems={bottomNavItems}
        profile={activeProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64 transition-all duration-300">
        {/* Dynamic Header */}
        <DashboardHeader titleOverride={headerTitle} profile={activeProfile} />

        {/* Dynamic Page Content with context support */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet
            context={{
              setHeaderTitle,
              profile: activeProfile,
              userProfile,
              refreshProfile: fetchProfile,
            }}
          />
        </main>
      </div>

      {/* Mobile "More" Grouped Bottom Sheet (Plans & Billing, Settings, Help & Support, Profile, Analytics) */}
      {role === "user" && isMoreSheetOpen && (
        <>
          <div
            onClick={closeMoreSheet}
            className={`lg:hidden fixed inset-0 z-30 bg-slate-900/35 backdrop-blur-[2px] ${
              isMoreSheetClosing
                ? "animate-backdrop-out"
                : "animate-backdrop-in"
            }`}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="More navigation options"
            className={`lg:hidden fixed inset-x-3 bottom-[4.75rem] z-40 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-4 space-y-3.5 origin-bottom ${
              isMoreSheetClosing ? "animate-sheet-down" : "animate-sheet-up"
            }`}
          >
            {/* Header with company summary + close button */}
            <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-slate-100 animate-sheet-item">
              <button
                type="button"
                onClick={() => handleMoreNavigate("/dashboard/company-profile")}
                className="flex items-center gap-2.5 min-w-0 text-left group active:scale-[0.98] transition-transform"
              >
                <div className="w-9 h-9 rounded-full bg-[#0E1538] text-white flex items-center justify-center font-bold text-xs tracking-wider shrink-0 overflow-hidden shadow-xs group-hover:ring-2 group-hover:ring-indigo-500/20 transition-all">
                  {activeProfile.logoUrl ? (
                    <img
                      src={activeProfile.logoUrl}
                      alt={activeProfile.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    activeProfile.initials || "YC"
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                    {activeProfile.company}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {activeProfile.industry}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={closeMoreSheet}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all active:scale-90 active:rotate-90 shrink-0"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Workspace Cards: Company Profile & Analytics */}
            <div
              className="grid grid-cols-2 gap-2 animate-sheet-item"
              style={{ animationDelay: "40ms" }}
            >
              {QUICK_WORKSPACE_ITEMS.map((item) => {
                const Icon = item.icon;
                const active =
                  normalizedPath === item.to ||
                  normalizedPath.startsWith(`${item.to}/`);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleMoreNavigate(item.to)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 ${
                      active
                        ? "bg-[#131B4D] text-white border-[#131B4D] shadow-md shadow-[#131B4D]/15"
                        : "bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/70"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        active
                          ? "bg-white/15 text-white scale-105"
                          : "bg-white text-[#131B4D] shadow-2xs"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold truncate">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Grouped Hub: Plans & Billing, Settings, Help & Support */}
            <div
              className="rounded-2xl bg-slate-50/90 border border-slate-200/70 p-1.5 space-y-1 animate-sheet-item"
              style={{ animationDelay: "80ms" }}
            >
              <div className="px-2.5 pt-1 pb-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Account, Billing & Support
              </div>
              {ACCOUNT_SUPPORT_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                const active =
                  normalizedPath === item.to ||
                  normalizedPath.startsWith(`${item.to}/`);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleMoreNavigate(item.to)}
                    style={{ animationDelay: `${100 + idx * 35}ms` }}
                    className={`group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 active:scale-[0.98] text-left animate-sheet-item ${
                      active
                        ? "bg-[#131B4D] text-white shadow-md shadow-[#131B4D]/15"
                        : "hover:bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          active
                            ? "bg-white/15 text-white"
                            : "bg-white text-slate-600 border border-slate-200/80"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold truncate ${
                            active ? "text-white" : "text-slate-900"
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[10px] truncate ${
                            active ? "text-slate-300" : "text-slate-400"
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${
                        active ? "text-white" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Sleek Mobile Bottom Navigation Bar */}
      {role === "user" && (
        <nav
          aria-label="Mobile quick navigation"
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-2 py-1.5 pb-safe flex items-center justify-around shadow-[0_-8px_24px_rgba(15,23,42,0.06)]"
        >
          {MOBILE_USER_TABS.map((tab) => {
            const Icon = tab.icon;
            const active =
              (!isMoreSheetOpen || isMoreSheetClosing) && isTabActive(tab);
            const isPopping =
              clickedTabKey && clickedTabKey.startsWith(`${tab.name}-`);

            if (tab.isPrimary) {
              return (
                <NavLink
                  key={tab.name}
                  to={tab.to}
                  onClick={() => {
                    triggerTabPop(tab.name);
                    if (isMoreSheetOpen) closeMoreSheet();
                  }}
                  className="group flex flex-col items-center justify-center -mt-4 select-none"
                >
                  <div
                    key={isPopping ? clickedTabKey : tab.name}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
                      isPopping ? "animate-nav-create-pop" : ""
                    } ${
                      active
                        ? "bg-indigo-600 text-white shadow-indigo-600/35 ring-4 ring-indigo-50"
                        : "bg-[#131B4D] text-white shadow-[#131B4D]/25 hover:bg-[#1a2563]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${
                        active ? "scale-110" : "group-hover:scale-105"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${
                      active ? "text-indigo-600" : "text-slate-600"
                    }`}
                  >
                    {tab.name}
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={tab.name}
                to={tab.to}
                onClick={() => {
                  triggerTabPop(tab.name);
                  if (isMoreSheetOpen) closeMoreSheet();
                }}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 select-none ${
                  active
                    ? "text-[#131B4D]"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {active && (
                  <span className="absolute -top-1.5 w-5 h-0.5 rounded-full bg-indigo-600 animate-nav-dot" />
                )}
                <div
                  key={isPopping ? clickedTabKey : tab.name}
                  className={`p-1.5 rounded-xl transition-all duration-300 ${
                    isPopping ? "animate-nav-tab-pop" : ""
                  } ${
                    active
                      ? "bg-indigo-50 text-indigo-600 shadow-2xs -translate-y-0.5"
                      : "translate-y-0"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] mt-0.5 transition-all duration-200 ${
                    active ? "font-extrabold text-indigo-600" : "font-semibold"
                  }`}
                >
                  {tab.name}
                </span>
              </NavLink>
            );
          })}

          {/* 5th Tab: Grouped "More" Menu Trigger with Icon Morph & Spring Pop */}
          <button
            type="button"
            onClick={toggleMoreSheet}
            aria-expanded={isMoreSheetOpen && !isMoreSheetClosing}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer select-none ${
              isMoreActive
                ? "text-[#131B4D]"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            {isMoreActive && (
              <span className="absolute -top-1.5 w-5 h-0.5 rounded-full bg-indigo-600 animate-nav-dot" />
            )}
            <div
              key={
                clickedTabKey && clickedTabKey.startsWith("More-")
                  ? clickedTabKey
                  : "More"
              }
              className={`p-1.5 rounded-xl transition-all duration-300 ${
                clickedTabKey && clickedTabKey.startsWith("More-")
                  ? "animate-nav-tab-pop"
                  : ""
              } ${
                isMoreActive
                  ? "bg-indigo-50 text-indigo-600 shadow-2xs -translate-y-0.5"
                  : "translate-y-0"
              }`}
            >
              {isMoreSheetOpen && !isMoreSheetClosing ? (
                <X className="w-4 h-4 transition-transform duration-300 rotate-90" />
              ) : (
                <MoreHorizontal className="w-4 h-4 transition-transform duration-300" />
              )}
            </div>
            <span
              className={`text-[10px] mt-0.5 transition-all duration-200 ${
                isMoreActive
                  ? "font-extrabold text-indigo-600"
                  : "font-semibold"
              }`}
            >
              More
            </span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default DashboardLanding;
