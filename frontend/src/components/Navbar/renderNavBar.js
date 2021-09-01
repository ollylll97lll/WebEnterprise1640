import AdminNav from "./AdminNav";
import CoordinatorNav from "./CoordinatorNav";
import GuestNav from "./GuestNav";
import HomeNav from "./HomeNav";
import ManagerNav from "./ManagerNav";
import StudentNav from "./StudentNav";

export function renderNavBar(role) {
    console.log(role)
    switch (role) {
        case 'admin':
            return <AdminNav />
        case 'coordinator':
            return <CoordinatorNav />
        case 'guest':
            return <GuestNav />
        case 'manager':
            return <ManagerNav />
        case 'student':
            return <StudentNav />
        default:
            return <HomeNav />
    }
}