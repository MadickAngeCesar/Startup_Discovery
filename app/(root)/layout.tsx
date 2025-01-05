import Navbar from "@/components/Navbar"

export default async function Layout({children}: Readonly<{children: React.ReactNode}>){
    return (
        <main className="font-work-sans">
            {await Navbar()}
            {children}
        </main>
    )
}