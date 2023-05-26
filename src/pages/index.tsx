import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { NewTweetForm, RecentTweets } from "~/components";
enum Tab {
  Recent = "Recent",
  Following = "Following",
}
const Home: NextPage = () => {
  const tabs = [Tab.Following, Tab.Recent];
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.Recent);
  const session = useSession();
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2">
        <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
        {session.status === "authenticated" && (
          <div className="flex">
            {tabs.map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                    tab === selectedTab
                      ? "border-b-4 border-b-blue-500 font-bold"
                      : ""
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <NewTweetForm />
      <RecentTweets onlyFollowing={selectedTab === Tab.Following} />
    </>
  );
};

export default Home;
