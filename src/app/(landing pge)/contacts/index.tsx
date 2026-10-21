import Image from "next/image";
import image1 from '@/app/Assets/jobify1.jpg'
import { Asterisk } from "lucide-react";

const Contacts = () => {
  return (
    <>
      <div className="mt-36 min-h-dvh text-green-600">
        <div>
          <div className="">
            <h1 className="text-center text-5xl font-extrabold">
              Get in Touch With Us
            </h1>
            <p className="text-gray-600 text-center text-xl/relaxed mt-10 max-w-3xl mx-auto">
              Have questions or need assistance? Reach out to our team for
              expert support and reliable solutions tailored to your needs.
            </p>
          </div>
          <div className="mx-40 mt-24">
            <h2 className="text-3xl font-semibold">Get in touch</h2>
            <p className="text-gray-600 text-lg/loose tracking-widest mt-4">
              Our friendly team would love to hear from you.
            </p>
          </div>
          <div className="flex">
            <div className="mx-40 mt-20 flex">
              <form action="">
                <div>
                  <label htmlFor="">
                    <h2 className="text-xl font-semibold flex">
                      Name{" "}
                      <span className="text-sm">
                        <Asterisk className="text-sm text-red-600 w-4" />
                      </span>
                    </h2>
                    <div className="flex gap-5">
                      <div>
                        <input
                          className="border border-gray-400 h-8 w-44 rounded-md placeholder:text-gray-400 pl-2 focus:border-green-500 focus:outline-none"
                          type="text"
                          placeholder="First name"
                        />
                        <p className="text-gray-500">First</p>
                      </div>
                      <div>
                        <input
                          className="border border-gray-400 h-8 w-44 rounded-md placeholder:text-gray-400 pl-2 focus:border-green-500 focus:outline-none"
                          type="text"
                          placeholder="Last name"
                        />
                        <p className="text-gray-500">Last</p>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="mt-4">
                  <label htmlFor="">
                    <h2 className="text-xl font-semibold flex">
                      Email{" "}
                      <span className="text-sm">
                        <Asterisk className="text-sm text-red-600 w-4" />
                      </span>
                    </h2>

                    <input
                      className="border border-gray-400 h-8 w-96 rounded-md  placeholder:text-gray-400 pl-2 focus:border-green-500 focus:outline-none"
                      type="email"
                      placeholder="example@gmail.com"
                    />
                  </label>
                </div>
                <div className="mt-4">
                  <label htmlFor="">
                    <h2 className="text-xl font-semibold flex">
                      Phone Number{" "}
                      <span className="text-sm">
                        <Asterisk className="text-sm text-red-600 w-4" />
                      </span>
                    </h2>

                    <input
                      className="border border-gray-400 h-8 w-96 rounded-md  placeholder:text-gray-400 pl-2 focus:border-green-500 focus:outline-none"
                      type="text"
                      placeholder="+234..."
                    />
                  </label>
                </div>
                <div className="mt-4">
                  <label htmlFor="">
                    <h2 className="text-xl font-semibold flex">
                      Message{" "}
                      <span className="text-sm">
                        <Asterisk className="text-sm text-red-600 w-4" />
                      </span>
                    </h2>
                  </label>
                  <textarea
                    className="border border-gray-400 h-40 w-96 rounded-md  placeholder:text-gray-400 pl-2 focus:border-green-500 focus:outline-none"
                    name=""
                    id=""
                  ></textarea>
                </div>
                <div className="mt-4">
                  <button className="border border-green-400 py-2 font-semibold w-96 rounded-full hover:bg-green-400 hover:text-white ">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
            <div>
              <Image src={image1} alt="" height={900} width={600}></Image>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contacts;
