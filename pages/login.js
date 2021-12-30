import { getProviders, signIn } from "next-auth/react"

function login({ providers }) {
    return (
        <div className="flex flex-col items-center justify-center bg-black min-h-screen w-full">
            <img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="" />

            {Object.values(providers).map(proivder => (
                <div key={proivder.name}>
                    <button className="bg-[#18D860] text-white p-5 rounded-full" onClick={() => signIn(proivder.id, { callbackUrl: '/' })}>
                        Login With {proivder.name}
                    </button>
                </div>
            ))}
        </div>
    )
}

export default login
export async function getServerSideProps(){
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}