import React, { FormEvent, useState } from "react";
import { type Book } from "wasp/entities";
import { type AuthUser } from "wasp/auth";
import { logout } from "wasp/client/auth";
import { useQuery, createBook, updateBook, deleteBook, getBooks } from "wasp/client/operations";
import booksLogo from "./books.jpeg";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Container,
  Box,
  SelectChangeEvent,
  Autocomplete,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";

export const MainPage = ({ user }: { user: AuthUser }) => {
  const { data: books, isLoading, error } = useQuery(getBooks);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" width="100%" sx={{ position: "fixed", top: 16, right: 16 }}>
        <Button variant="contained" color="primary" onClick={logout}>
          Logout
        </Button>
      </Box>
      {books && <StatsBox books={books} />}
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <Box sx={{ maxWidth: "150px", borderRadius: 2, overflow: 'hidden' }}>
            <img src={booksLogo} alt="books logo" style={{ display: 'block', width: '100%' }} />
          </Box>
          {user && (
            <Typography variant="h4" gutterBottom>
              {`${user.identities.username?.id}'s Reading Log`}
            </Typography>
          )}
          <NewBookForm />
          {books && <BooksList books={books} />}
        </Box>
      </Container>
    </>
  );
};


function BooksList({ books }: { books: Book[] }) {
  const [orderBy, setOrderBy] = useState<keyof Book>("title");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [authorFilter, setAuthorFilter] = useState<string>("");
  // Extract unique authors from the books list
  const uniqueAuthors = Array.from(new Set(books.map((book) => book.author)));
  const [formatFilter, setFormatFilter] = useState<string>("");
  const [yearReadFilter, setYearReadFilter] = useState<number | null>(null);

  const handleSort = (property: keyof Book) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  const filteredBooks = sortedBooks.filter((book) => {
    const matchesAuthor = authorFilter ? book.author.toLowerCase().includes(authorFilter.toLowerCase()) : true;
    const matchesFormat = formatFilter ? book.type === formatFilter : true;
    const matchesYearRead = yearReadFilter ? book.yearRead === yearReadFilter : true;
    return matchesAuthor && matchesFormat && matchesYearRead;
  });

  return (
    <>
      <Box display="flex" gap={2} mb={2}>
        <Autocomplete
          value={authorFilter}
          onChange={(event, newValue) => setAuthorFilter(newValue || "")}
          inputValue={authorFilter}
          onInputChange={(event, newInputValue) => setAuthorFilter(newInputValue)}
          options={uniqueAuthors}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Author"
              size="small"
              sx={{ width: "200px" }}
            />
          )}
          freeSolo
        />
        <Select
          label="Format"
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value as string)}
          size="small"
          sx={{ width: "200px" }}
        >
          <MenuItem value="">All Formats</MenuItem>
          <MenuItem value="written">Written</MenuItem>
          <MenuItem value="audio">Audio</MenuItem>
        </Select>
        <Select
          label="Year Read"
          value={yearReadFilter || ""}
          onChange={(e) => setYearReadFilter(e.target.value ? Number(e.target.value) : null)}
          size="small"
          sx={{ width: "200px" }}
        >
          <MenuItem value="">All Years</MenuItem>
          <MenuItem value={2024}>2024</MenuItem>
          <MenuItem value={2025}>2025</MenuItem>
          <MenuItem value={2026}>2026</MenuItem>
          <MenuItem value={2027}>2027</MenuItem>
          <MenuItem value={2028}>2028</MenuItem>
        </Select>
      </Box>
      <TableContainer component={Paper} sx={{ width: "100%", overflowX: "auto" }}>
      <Table size="small" sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
            <TableCell sx={{ padding: "8px", width: "5%" }}>
              <TableSortLabel
                active={orderBy === "id"}
                direction={orderBy === "id" ? order : "asc"}
                onClick={() => handleSort("id")}
              >
                #
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "40%" }}>
              <TableSortLabel
                active={orderBy === "title"}
                direction={orderBy === "title" ? order : "asc"}
                onClick={() => handleSort("title")}
              >
                Title
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "20%" }}>
              <TableSortLabel
                active={orderBy === "author"}
                direction={orderBy === "author" ? order : "asc"}
                onClick={() => handleSort("author")}
              >
                Author
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "10%" }}>
              <TableSortLabel
                active={orderBy === "type"}
                direction={orderBy === "type" ? order : "asc"}
                onClick={() => handleSort("type")}
              >
                Format
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "10%" }}>
              <TableSortLabel
                active={orderBy === "yearRead"}
                direction={orderBy === "yearRead" ? order : "asc"}
                onClick={() => handleSort("yearRead")}
              >
                Year Read
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "10%" }}>
              <TableSortLabel
                active={orderBy === "status"}
                direction={orderBy === "status" ? order : "asc"}
                onClick={() => handleSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ padding: "8px", width: "5%" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBooks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                No books match the filters.
              </TableCell>
            </TableRow>
          ) : (
            filteredBooks.map((book, index) => (
              <TableRow
                key={book.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)", // Light gray background on hover
                  },
                }}
              >
                <TableCell sx={{ padding: "8px" }}>{index + 1}</TableCell>
                <TableCell sx={{ padding: "8px" }}>{book.title}</TableCell>
                <TableCell sx={{ padding: "8px" }}>{book.author}</TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  {book.type.charAt(0).toUpperCase() + book.type.slice(1)}
                </TableCell>
                <TableCell sx={{ padding: "8px" }}>{book.yearRead}</TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  <Select
                    size="small"
                    sx={{
                      ".MuiSelect-select": {
                        backgroundColor:
                          book.status === "read"
                            ? "lightgreen"
                            : book.status === "currently reading"
                              ? "khaki"
                            : "lightblue",
                         padding: "4px 8px",
                      },
                      height: "30px",
                    }}
                    value={book.status}
                    onChange={(event: SelectChangeEvent) =>
                      void updateBook({
                        id: book.id,
                        author: book.author,
                        title: book.title,
                        type: book.type,
                        status: event.target.value,
                        yearRead: book.yearRead,
                      })
                    }
                  >
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="currently reading">Currently Reading</MenuItem>
                    <MenuItem value="will read">Will Read</MenuItem>
                  </Select>
                </TableCell>
                <TableCell sx={{ padding: "8px" }}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => void deleteBook(book.id)}
                    size="small"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  );
}

function StatsBox({ books }: { books: Book[] }) {
  // Calculate total number of books
  const totalBooks = books.length;

  // Calculate number of written and audio books
  const writtenBooks = books.filter((book) => book.type === "written").length;
  const audioBooks = books.filter((book) => book.type === "audio").length;

  // Calculate breakdown of books by year
  const booksByYear = books.reduce((acc, book) => {
    acc[book.yearRead] = (acc[book.yearRead] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Data for the pie chart
  const pieChartData = [
    { id: 0, value: writtenBooks, label: "Written Books" },
    { id: 1, value: audioBooks, label: "Audio Books" },
  ];

  return (
    <Box
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        backgroundColor: "white",
        padding: 2,
        borderRadius: 1,
        boxShadow: 1,
        width: "300px",
        zIndex: 1,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Stats
      </Typography>
      <Typography variant="body1">
        Total Books: <strong>{totalBooks}</strong>
      </Typography>
      <Typography variant="body1" gutterBottom>
        Books by Format:
      </Typography>
      <PieChart
        series={[
          {
            data: pieChartData,
            innerRadius: 20,
            outerRadius: 60,
            paddingAngle: 5,
            cornerRadius: 5,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 20, additionalRadius: -20, color: "gray" },
          },
        ]}
        height={150}
        width={250}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "bottom", horizontal: "right" },
            padding: { left: 50 },
            labelStyle: {
              fontSize: 12,
            },
          },
        }}
      />
      <Typography variant="body1" gutterBottom>
        Books by Year:
      </Typography>
      <BarChart
        xAxis={[
          {
            dataKey: "year",
            scaleType: "band",
          },
        ]}
        series={[
          {
            dataKey: "count",
            label: "Books Read",
            color: "#1f77b4",
          },
        ]}
        dataset={Object.entries(booksByYear).map(([year, count]) => ({
          year: Number(year),
          count,
        }))}
        height={200}
        width={250}
        margin={{ top: 10 }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
    </Box>
  );
}

function NewBookForm() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const author = (event.currentTarget.elements.namedItem("author") as HTMLInputElement).value;
      const title = (event.currentTarget.elements.namedItem("title") as HTMLInputElement).value;
      const type = (event.currentTarget.elements.namedItem("type") as HTMLSelectElement).value;
      const status = (event.currentTarget.elements.namedItem("status") as HTMLSelectElement).value;
      const yearRead = parseInt((event.currentTarget.elements.namedItem("yearRead") as HTMLSelectElement).value);

      event.currentTarget.reset();
      await createBook({ author, title, type, status, yearRead: yearRead || 2024 });
    } catch (err: any) {
      window.alert("Error: " + err?.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2}
      mb={4}
      sx={{ width: "100%", maxWidth: 800 }}
    >
      <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "33.33%" }}>
          <Typography variant="subtitle2">Author</Typography>
          <TextField
            name="author"
            required
            size="small"
            sx={{ width: "100%" }}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "66.66%" }}>
          <Typography variant="subtitle2">Title</Typography>
          <TextField
            name="title"
            required
            size="small"
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>
      <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "33.33%" }}>
          <Typography variant="subtitle2">Format</Typography>
          <Select
            name="type"
            required
            defaultValue="written"
            size="small"
            sx={{ width: "100%", height: "40px" }}
          >
            <MenuItem value="written">Written</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </Select>
        </Box>
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "33.33%" }}>
          <Typography variant="subtitle2">Status</Typography>
          <Select
            name="status"
            required
            defaultValue="read"
            size="small"
            sx={{ width: "100%", height: "40px" }}
          >
            <MenuItem value="read">Read</MenuItem>
            <MenuItem value="currently reading">Currently Reading</MenuItem>
            <MenuItem value="will read">Will Read</MenuItem>
          </Select>
        </Box>
        <Box display="flex" flexDirection="column" gap={1} sx={{ width: "33.33%" }}>
          <Typography variant="subtitle2">Year Read</Typography>
          <Select
            name="yearRead"
            required
            defaultValue="2024"
            size="small"
            sx={{ width: "100%", height: "40px" }}
          >
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
            <MenuItem value={2027}>2027</MenuItem>
            <MenuItem value={2028}>2028</MenuItem>
          </Select>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="small"
          sx={{ width: "fit-content", px: 4 }}
        >
          Add Book
        </Button>
      </Box>
    </Box>
  );
}
