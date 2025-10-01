import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { SignInButton, UserButton } from "@clerk/nextjs";
import ModeToggle from "../../../components/ModeToggle";
// import { currentUser } from "@clerk/nextjs/server";

async function DesktopNavbar() {
  //Getting the user from clerk. Since its a server component, this server method is used
  // const user = await currentUser();
  //if this was a client component, useAuth() hook from clerk can be used as well

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/notifications">
          <BellIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href={`/profile/`}>
          <UserIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Profile</span>
        </Link>
      </Button>
    </div>
  );
}
export default DesktopNavbar;
//       {/* <UserButton /> */}

//   {/* {user ? (
//     // If user is authenticated (ie: user object exists)
//     <>
//       <Button variant="ghost" className="flex items-center gap-2" asChild>
//         <Link href="/notifications">
//           <BellIcon className="w-4 h-4" />
//           <span className="hidden lg:inline">Notifications</span>
//         </Link>
//       </Button>
//       <Button variant="ghost" className="flex items-center gap-2" asChild>
//         <Link
//           href={`/profile/${
//             user.username ??
//             user.emailAddresses[0].emailAddress.split("@")[0]
//           }`}
//         >
//           <UserIcon className="w-4 h-4" />
//           <span className="hidden lg:inline">Profile</span>
//         </Link>
//       </Button>
//       <UserButton />
//     </>
//   ) : (
//     // If user is not authenticated
//     <SignInButton mode="modal">
//       <Button variant="default">Sign In</Button>
//     </SignInButton>
//   )}
// </div> */}
