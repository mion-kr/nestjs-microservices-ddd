import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { Prisma, PrismaClient } from '@prisma/client';

export const extendedPrismaClient = new PrismaClient().$extends({
  name: 'common',
  query: {
    $allModels: {
      async create({ model, operation, args, query }) {
        addUpdateBy(args);
        return query(args);
      },

      async update({ model, operation, args, query }) {
        addUpdateBy(args);
        return query(args);
      },

      async upsert({ model, operation, args, query }) {
        addUpdateBy(args, operation);
        return query(args);
      },
    },
  },
  // TODO :: 테스트 필요. 코드 어시스트 안됨
  model: {
    $allModels: {
      async softDelete<T>(
        this: T,
        where: Prisma.Args<T, 'findFirst'>['where'],
      ) {
        const context = Prisma.getExtensionContext(this);

        const result = await (context as any).findFirst({ where });
        result.deletedAt = new Date();
      },
      async exists<T>(
        this: T,
        where: Prisma.Args<T, 'findFirst'>['where'],
      ): Promise<boolean> {
        // Get the current model at runtime
        const context = Prisma.getExtensionContext(this);

        const result = await (context as any).findFirst({ where });
        return result !== null;
      },
    },
  },
});

const addUpdateBy = (args, operation?) => {
  // console.log(args, operation);
  if (isEmpty(args?.data?.updateBy)) {
    if (operation === 'upsert') {
      args.create.updateBy = args.create.createBy;
    } else {
      args.data.updateBy = args.data.createBy;
    }
  }
};
