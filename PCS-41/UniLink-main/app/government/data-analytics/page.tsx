"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const jobData = [
  {
    department: "CS",
    placed: 120,
    unplaced: 30,
    malePlaced: 80,
    femalePlaced: 40,
    maleUnplaced: 20,
    femaleUnplaced: 10,
  },
  {
    department: "ME",
    placed: 90,
    unplaced: 40,
    malePlaced: 70,
    femalePlaced: 20,
    maleUnplaced: 30,
    femaleUnplaced: 10,
  },
  {
    department: "EE",
    placed: 150,
    unplaced: 20,
    malePlaced: 100,
    femalePlaced: 50,
    maleUnplaced: 15,
    femaleUnplaced: 5,
  },
  {
    department: "EC",
    placed: 80,
    unplaced: 50,
    malePlaced: 50,
    femalePlaced: 30,
    maleUnplaced: 25,
    femaleUnplaced: 25,
  },
  {
    department: "CE",
    placed: 110,
    unplaced: 60,
    malePlaced: 70,
    femalePlaced: 40,
    maleUnplaced: 35,
    femaleUnplaced: 25,
  },
];

const GovernmentDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex p-4 gap-4">
        <Card className="flex flex-col flex-1 border rounded-md p-2">
          <CardHeader className="items-center pb-0">
            <CardTitle>Placement by Department</CardTitle>
            <CardDescription>
              Overview of placements per department
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 py-4">
            <ChartContainer config={chartConfig}>
              <BarChart data={jobData}>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <XAxis
                  dataKey="department"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Bar
                  dataKey="placed"
                  fill="hsl(var(--chart-1))"
                  barSize={50}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm text-center">
            <div className="leading-none text-muted-foreground">
              Data fetched from placement records, grouped by department
            </div>
          </CardFooter>
        </Card>
        <Card className="flex flex-col flex-1 border rounded-md p-2">
          <CardHeader className="items-center pb-0">
            <CardTitle>Non Placed Student by Department</CardTitle>
            <CardDescription>
              Overview of non-placements per department
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 py-4">
            <ChartContainer config={chartConfig}>
              <BarChart data={jobData}>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <XAxis
                  dataKey="department"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Bar
                  dataKey="unplaced"
                  fill="hsl(var(--chart-1))"
                  barSize={50}
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm text-center">
            <div className="leading-none text-muted-foreground">
              Data fetched from placement records, grouped by department
            </div>
          </CardFooter>
        </Card>
      </div>
      <Card className="flex flex-col  rounded-md p-2  border mx-auto">
        <CardHeader className="items-center pb-0">
          <CardTitle>Gender Wise Placement by Department</CardTitle>
          <CardDescription>
            Overview of gender-wise placements per department
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <ChartContainer config={chartConfig} className="w-[800px]">
            <BarChart data={jobData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Bar
                dataKey="malePlaced"
                fill="hsl(var(--chart-1))"
                barSize={50}
                radius={4}
              />
              <Bar
                dataKey="femalePlaced"
                fill="hsl(var(--chart-2))"
                barSize={50}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-center">
          <div className="leading-none text-muted-foreground">
            Data fetched from placement records, grouped by department
          </div>
        </CardFooter>
      </Card>
      <Card className="flex flex-col  rounded-md p-2  border mx-auto">
        <CardHeader className="items-center pb-0">
          <CardTitle>Gender Wise Non Placed Student by Department</CardTitle>
          <CardDescription>
            Overview of gender-wise non-placements per department
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 py-4">
          <ChartContainer config={chartConfig} className="w-[800px]">
            <BarChart data={jobData}>
              <CartesianGrid vertical={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <XAxis
                dataKey="department"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis />
              <Bar
                dataKey="maleUnplaced"
                fill="hsl(var(--chart-1))"
                barSize={50}
                radius={4}
              />
              <Bar
                dataKey="femaleUnplaced"
                fill="hsl(var(--chart-2))"
                barSize={50}
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm text-center">
          <div className="leading-none text-muted-foreground">
            Data fetched from placement records, grouped by department
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GovernmentDashboard;
