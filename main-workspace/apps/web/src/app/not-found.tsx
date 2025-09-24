import type { Metadata } from "next";
import type { ReactElement } from "react";
import NotFoundContent from "../components/not-found-content";

export const metadata: Metadata = {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
};

const NotFoundPage = (): ReactElement => <NotFoundContent />;
export default NotFoundPage;
