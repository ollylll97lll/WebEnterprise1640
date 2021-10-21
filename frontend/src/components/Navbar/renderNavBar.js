import AdminNav from "./AdminNav";
import CoordinatorNav from "./CoordinatorNav";
import GuestNav from "./GuestNav";
import HomeNav from "./HomeNav";
import ManagerNav from "./ManagerNav";
import StaffNav from "./StudentNav";

export function renderNavBar(role) {
    switch (role) {
        case 'admin':
            return <AdminNav />
        case 'coordinator':
            return <CoordinatorNav />
        case 'guest':
            return <GuestNav />
        case 'manager':
            return <ManagerNav />
        case 'staff':
            return <StaffNav />
        default:
            return <HomeNav />
    }
}