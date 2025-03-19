import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  CalendarDateRangeIcon,
  ChevronRightIcon,
  HomeIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  Navigate,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigate,
} from "react-router";
import { USER } from "../../util/types";
import ProtectedLayout from "../auth/ProtectedLayout";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: HomeIcon },
  {
    name: "Events",
    icon: CalendarDateRangeIcon,
    children: [
      { name: "Event Lists", href: "/admin/events" },
      { name: "Add Event", href: "/admin/events/add" },
    ],
  },
  { name: "Users", href: "/admin/users", icon: UserGroupIcon },
  {
    name: "Others",
    icon: WrenchScrewdriverIcon,
    children: [
      { name: "Band Types & Prices", href: "/admin/bands" },
      { name: "Discount Rates", href: "/admin/discounts" },
    ],
  },
];

const AdminLayout = () => {
  const [user, setUser] = useState<USER | null>(useLoaderData());
  const navigate = useNavigate();

  if (user == null) {
    return <Navigate to="/login" replace />;
  }

  if (user && user.role !== "ADMIN") {
    return <ProtectedLayout />;
  }

  const signOutHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
    return navigate("/");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="size-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-cyan-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center font-extrabold text-xl text-cyan-200">
                  GCT
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            {!item.children ? (
                              <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                  isActive
                                    ? "bg-cyan-950 text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                    : "text-cyan-200 hover:bg-cyan-900 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                }
                                end
                              >
                                <item.icon
                                  aria-hidden="true"
                                  className={"size-6 shrink-0"}
                                />
                                {item.name}
                              </NavLink>
                            ) : (
                              <Disclosure as="div">
                                <DisclosureButton
                                  className={
                                    "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-cyan-200 hover:bg-cyan-900 hover:text-white"
                                  }
                                >
                                  <item.icon
                                    aria-hidden="true"
                                    className="size-6 shrink-0"
                                  />
                                  {item.name}
                                  <ChevronRightIcon
                                    aria-hidden="true"
                                    className="ml-auto size-5 shrink-0 group-data-open:rotate-90"
                                  />
                                </DisclosureButton>
                                <DisclosurePanel as="ul" className="mt-1 px-2">
                                  {item.children.map((subItem) => (
                                    <li key={subItem.name}>
                                      {/* 44px */}
                                      <NavLink
                                        to={subItem.href}
                                        className={({ isActive }) =>
                                          isActive
                                            ? "bg-cyan-950 text-white group block rounded-md py-2 pr-2 pl-9 text-sm/6"
                                            : "text-cyan-200 hover:bg-cyan-950 hover:text-white group block rounded-md py-2 pr-2 pl-9 text-sm/6"
                                        }
                                        end
                                      >
                                        {subItem.name}
                                      </NavLink>
                                    </li>
                                  ))}
                                </DisclosurePanel>
                              </Disclosure>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-cyan-900 px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center font-extrabold text-xl text-cyan-200">
              GCT
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        {!item.children ? (
                          <NavLink
                            to={item.href}
                            className={({ isActive }) =>
                              isActive
                                ? "bg-cyan-950 text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                : "text-cyan-200 hover:bg-cyan-950 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                            }
                            end
                          >
                            <item.icon
                              aria-hidden="true"
                              className={"size-6 shrink-0"}
                            />
                            {item.name}
                          </NavLink>
                        ) : (
                          <Disclosure as="div">
                            <DisclosureButton
                              className={
                                "group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold text-cyan-200 hover:bg-cyan-950 hover:text-white"
                              }
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.name}
                              <ChevronRightIcon
                                aria-hidden="true"
                                className="ml-auto size-5 shrink-0 group-data-open:rotate-90"
                              />
                            </DisclosureButton>
                            <DisclosurePanel
                              as="ul"
                              className="mt-1 px-2 space-y-1"
                            >
                              {item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  <NavLink
                                    to={subItem.href}
                                    className={({ isActive }) =>
                                      isActive
                                        ? "bg-cyan-950 text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                        : "text-cyan-200 hover:bg-cyan-950 hover:text-white group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                    }
                                    end
                                  >
                                    {subItem.name}
                                  </NavLink>
                                </li>
                              ))}
                            </DisclosurePanel>
                          </Disclosure>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form action="#" method="GET" className="grid flex-1 grid-cols-1">
                <input
                  name="search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm/6 font-semibold text-gray-900"
                      >
                        {user.name}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-2 size-5 text-gray-400"
                      />
                    </span>
                  </MenuButton>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      <form onSubmit={signOutHandler}>
                        <button className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden">
                          Sign out
                        </button>
                      </form>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">
              <Outlet context={user} />
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
