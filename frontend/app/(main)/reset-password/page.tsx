

export default function resetPassword() {
   

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto my-12 bg-gray-900 rounded-lg p-12">
                    <div className="grid md:grid-cols-2 gap-8">
                     
                        <hr className='md:hidden lg:hidden' />

                        <div className="flex flex-col justify-center ">
                            <h2 className="text-3xl font-bold text-center">
                                Join <span className="text-cyan-400 ">BrainSync</span>!
                            </h2>
                            <p className="text-gray-400 mt-2 text-center">
                                Create an account to unlock collaborative study tools and resources
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}