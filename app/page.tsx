"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "@/data/users";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const hanldechat = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white ">
      <section className=" mx-auto pt-20 pb-16 px-4">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-transparent bg-clip-text animate-gradient">
            Chai pe Charcha ☕
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Connect with experts and have meaningful conversations over a cup of
            chai.
          </p>
        </div>

        {/* User Cards */}
        <div className="flex gap-10  items-center justify-center ">
          {Users.map((user) => (
            <Card
              key={user.id}
              className=" relative bg-zinc-800 border-zinc-700 overflow-hidden group hover:border-purple-500 transition-all duration-300 w-[800px] h-[300px] "
            >
              <div className="absolute z-0 inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-purple-500">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {user.name}
                      </h3>
                      <p className="text-zinc-400">{user.title}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {user.summary.map((line, index) => (
                    <p className="text-zinc-300 text-center" key={index}>
                      {line}
                    </p>
                  ))}

                  <div className="flex flex-wrap gap-2 justify-center items-center">
                    {user.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={() => hanldechat(user.id)}
                    className="cursor-pointer mt-5 w-[100px] mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                  >
                    Start chat
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        
      </section>
    </div>
  );
}
