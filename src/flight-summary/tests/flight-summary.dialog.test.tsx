import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

import { Info } from "../flight-summary";
import { testEntry } from "./testdata";


describe("Event info dialog", () => {

  beforeEach(() => {
    cleanup();
  });

  it("Should render", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByText("Test Event")).toBeDefined();
    expect(screen.getByText("Time")).toBeDefined();
    expect(screen.getByText("Latitude")).toBeDefined();
    expect(screen.getByText("Longitude")).toBeDefined();
    expect(screen.getByText("Altitude")).toBeDefined();
    expect(screen.getByText("Heading")).toBeDefined();
    expect(screen.getByText("Test Comment")).toBeDefined();
    expect(screen.getByText("Close")).toBeDefined();
  });

  it("Should not render when entry is null", () => {
    render(<Info entry={null} clearEntry={()=>{}}/>);
    expect(screen.queryByText("Test Event")).toBeNull();
  })

  it("Should call clearEntry when close button is clicked", () => {
    const clearEntry = vi.fn();
    render(<Info entry={testEntry} clearEntry={clearEntry}/>);
    fireEvent.click(screen.getByText("Close"));
    expect(clearEntry).toHaveBeenCalledOnce();
  })

  it("Should format the start time correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-start-time")).toHaveTextContent(new Date(testEntry.start.time * 1e3).toLocaleTimeString());
  });

  it("Should format the end time correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-time")).toHaveTextContent(new Date((testEntry.stop?.time || -999) * 1e3).toLocaleTimeString());
  })

  it("Should format the start latitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-start-lat")).toHaveTextContent(testEntry.start.latitude.toFixed(2) + " °");
  })

  it("Should format the end latitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-lat")).toHaveTextContent((testEntry.stop?.latitude || -999).toFixed(2) + " °");
  })

  it("Should format the start longitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-start-lon")).toHaveTextContent(testEntry.start.longitude.toFixed(2) + " °");
  })

  it("Should format the end longitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-lon")).toHaveTextContent((testEntry.stop?.longitude || -999).toFixed(2) + " °");
  })

  it("Should format the start altitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-start-alt")).toHaveTextContent(testEntry.start.altitude + " ft");
  })

  it("Should format the end altitude correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-stop-alt")).toHaveTextContent((testEntry.stop?.altitude || -999) + " ft");
  })

  it("Should format the start heading correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-start-hdg")).toHaveTextContent(testEntry.start.heading.toFixed(0) + "°");
  })

  it("Should format the end heading correctly", () => {
    render(<Info entry={testEntry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-hdg")).toHaveTextContent((testEntry.stop?.heading || -999).toFixed(0) + "°");
  })

  it("Should not render end time if it is not defined", () => {
    const entry = {...testEntry, stop: {time: undefined}};
    render(<Info entry={entry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-time")).toHaveTextContent("");
  })

  it("Should not render end latitude if it is not defined", () => {
    const entry = {...testEntry, stop: {latitude: undefined}};
    render(<Info entry={entry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-lat")).toHaveTextContent("");
  })

  it("Should not render end longitude if it is not defined", () => {
    const entry = {...testEntry, stop: {longitude: undefined}};
    render(<Info entry={entry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-lon")).toHaveTextContent("");
  })

  it("Should not render end altitude if it is not defined", () => {
    const entry = {...testEntry, stop: {altitude: undefined}};
    render(<Info entry={entry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-stop-alt")).toHaveTextContent("");
  })

  it("Should not render end heading if it is not defined", () => {
    const entry = {...testEntry, stop: {heading: undefined}};
    render(<Info entry={entry} clearEntry={()=>{}}/>);
    expect(screen.getByTestId("fs-evt-end-hdg")).toHaveTextContent("");
  })
});