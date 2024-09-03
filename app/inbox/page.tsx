"use client";
import {MailComponent} from "@/components/mail/mailComponent";
import { accounts, mails } from "@/components/mail/data"
import {useEffect} from "react";

export default function Inbox() {
    useEffect(() =>
    {
        document.body.classList.add("overflow-hidden");
    });

    return (
        <div className="hidden flex-col md:flex overflow-hidden">
            <MailComponent
                accounts={accounts}
                mails={mails}
                defaultLayout={[265, 440, 655]}
                defaultCollapsed={false}
                navCollapsedSize={4}
            />
        </div>
    )
}
