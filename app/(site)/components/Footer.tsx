const Footer: React.FC = () => {
    return (
        <footer className="m-4 mt-24 rounded-xl bg-gray-300 shadow dark:bg-gray-900">
            <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm  dark:text-gray-400 sm:text-center">
                    © 2023{" "}
                    <a href="#" className="hover:underline">
                        Caesar Docs™
                    </a>
                    .
                </span>
                <ul className="mt-3 flex flex-wrap items-center text-sm font-medium  dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="#" className="me-4 hover:underline md:me-6">
                            About
                        </a>
                    </li>
                    <li>
                        <a href="#" className="me-4 hover:underline md:me-6">
                            Privacy Policy
                        </a>
                    </li>
                    <li>
                        <a href="#" className="me-4 hover:underline md:me-6">
                            Licensing
                        </a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">
                            Contact
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
