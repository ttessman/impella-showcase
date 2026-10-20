/** Component declarations are separate boundaries; ordinary constants are unrestricted. */
export const oneComponentPerFile = {
  meta: {
    type: "suggestion",
    schema: [],
    messages: {
      multiple:
        "Keep each React component in its own file; {{name}} needs a separate component file. Constants can remain.",
    },
  },
  create(context) {
    return {
      Program(program) {
        const components = program.body.flatMap((statement) => {
          const declaration =
            statement.type === "ExportNamedDeclaration" ||
            statement.type === "ExportDefaultDeclaration"
              ? statement.declaration
              : statement;
          if (
            declaration?.type === "FunctionDeclaration" &&
            /^[A-Z]/.test(declaration.id?.name ?? "")
          )
            return [declaration];
          if (declaration?.type === "VariableDeclaration") {
            return declaration.declarations.filter(
              (item) =>
                item.id.type === "Identifier" &&
                /^[A-Z]/.test(item.id.name) &&
                ["ArrowFunctionExpression", "FunctionExpression"].includes(
                  item.init?.type,
                ),
            );
          }
          return [];
        });
        components.slice(1).forEach((component) =>
          context.report({
            node: component,
            messageId: "multiple",
            data: { name: component.id.name },
          }),
        );
      },
    };
  },
};
