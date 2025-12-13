import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
// eslint-disable-next-line import/no-unresolved
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// eslint-disable-next-line import/no-unresolved
import { Button } from "@/components/ui/button";
// eslint-disable-next-line import/no-unresolved
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define the search params schema
const blockedSearchSchema = z.object({
  d: z.string().optional(),
});

// Define the decoded data schema
const blockedDataSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  descr: z.string(),
  categories: z.string().optional(),
});

export const Route = createFileRoute("/blocked")({
  validateSearch: blockedSearchSchema,
  // Redirect away if there is no encoded data present
  beforeLoad: ({ search }) => {
    if (!search.d) {
      throw redirect({ to: "/" });
    }
  },
  component: BlockedPage,
});

type BlockedData = z.infer<typeof blockedDataSchema>;

// Query function to decode and validate blocked data
const decodeBlockedData = async (encodedData: string): Promise<BlockedData> => {
  try {
    // Properly decode UTF-8 from base64
    const binaryString = atob(encodedData);
    const bytes = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
    const decodedString = new TextDecoder("utf-8").decode(bytes);
    const parsedData = JSON.parse(decodedString);
    return blockedDataSchema.parse(parsedData);
  } catch (error) {
    throw new Error(
      `Invalid blocked data: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

function BlockedPage() {
  const { d } = Route.useSearch();
  const navigate = useNavigate();

  // Use React Query to handle data decoding and validation
  const {
    data: decodedData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blocked-data", d],
    queryFn: () =>
      d ? decodeBlockedData(d) : Promise.reject(new Error("No data provided")),
    enabled: !!d,
    retry: false,
    staleTime: Infinity, // This data doesn't change, so cache indefinitely
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading blocked page...</p>
        </div>
      </div>
    );
  }

  // If decoding failed, show a friendly error card with a way home
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {/* Light/Dark logo swap */}
              <img
                src="/logo_light.png"
                alt="Focusd Work"
                className="h-8 block dark:hidden"
              />
              <img
                src="/logo_dark.png"
                alt="Focusd Work"
                className="h-8 hidden dark:block"
              />
            </div>
            <CardTitle>Invalid Blocked Link</CardTitle>
            <CardDescription>
              We couldn't read the block details. Try again.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Go to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  // If no valid data, render nothing (route guard prevents most cases)
  if (!decodedData) {
    return null;
  }

  // Parse categories
  const categories = JSON.parse(decodedData.categories || "[]");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {/* Light/Dark logo swap */}
            <img
              src="/logo_light.png"
              alt="Focusd Work"
              className="h-16 block dark:hidden"
            />
            <img
              src="/logo_dark.png"
              alt="Focusd Work"
              className="h-16 hidden dark:block"
            />
          </div>
          <CardTitle className="flex items-center gap-2 justify-center">
            <ShieldCheck className="h-4 w-4 text-red-500" />
            <span className="text-lg font-semibold">
              Website Blocked by Focusd Work
            </span>
          </CardTitle>
          <Separator className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Website Title */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {decodedData.title}
            </h2>
            <p className="text-sm text-muted-foreground break-all">
              {decodedData.url}
            </p>
          </div>
          {/* Blocking Reason */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Why was this blocked?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {decodedData.descr}
            </p>
          </div>
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category: string, index: number) => (
                <Badge
                  variant="destructive"
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-xs bg-secondary text-secondary-foreground"
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* How to allow usage */}
          <div className="rounded-lg border bg-muted/40 p-4 flex items-start gap-3">
            <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              If you want to use this blocked resource, open the <strong>Focusd Work</strong> app and
              allow usage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
