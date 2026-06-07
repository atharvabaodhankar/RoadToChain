export * from "./seo/schemas";

import { organizationSchema, courseSchema } from "./seo/schemas";

export const generateCourseJsonLd = organizationSchema;
export const generateTrackJsonLd = courseSchema;
